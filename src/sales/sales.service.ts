import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Sale } from './sale.entity';
import { SaleItem } from './sale-item.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Product } from '../inventory/product.entity';
import { StockBatch } from '../inventory/stock-batch.entity';
import { StockMovement } from '../inventory/stock-movement.entity';

@Injectable()
export class SalesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Sale) private readonly sales: Repository<Sale>,
    @InjectRepository(SaleItem) private readonly items: Repository<SaleItem>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(StockBatch)
    private readonly batches: Repository<StockBatch>,
    @InjectRepository(StockMovement)
    private readonly moves: Repository<StockMovement>,
  ) {}

  private sortBatchesFEFO(batches: StockBatch[]) {
    const now = new Date();
    return [...batches]
      .filter((b) => b.quantity > 0)
      .sort((a, b) => {
        const aExp = a.expirationDate ? new Date(a.expirationDate) : null;
        const bExp = b.expirationDate ? new Date(b.expirationDate) : null;
        const aValid = aExp ? aExp >= now : true;
        const bValid = bExp ? bExp >= now : true;
        if (aValid !== bValid) return aValid ? -1 : 1;
        if (aExp && bExp) {
          const diff = aExp.getTime() - bExp.getTime();
          if (diff !== 0) return diff;
        } else if (aExp && !bExp) {
          return -1;
        } else if (!aExp && bExp) {
          return 1;
        }
        return (
          (a.createdAt?.getTime?.() ?? 0) - (b.createdAt?.getTime?.() ?? 0)
        );
      });
  }

  async create(dto: CreateSaleDto) {
    if (!dto.items?.length) throw new BadRequestException('Sin items');
    const consumeInv = dto.consumeInventory ?? true;

    const saved = await this.dataSource.transaction(async (trx) => {
      // validar productos y preparar mapa
      const productMap = new Map<number, Product>();
      for (const it of dto.items) {
        const product = await trx.getRepository(Product).findOne({ where: { id: it.productId } });
        if (!product) throw new NotFoundException(`Producto ${it.productId} no encontrado`);
        productMap.set(product.id, product);
      }

      // guardar venta sin items (evita cascadas y updates vacíos)
      const saleRepo = trx.getRepository(Sale);
      const itemRepo = trx.getRepository(SaleItem);
      const sale = saleRepo.create({ note: dto.note ?? null });
      const savedSale = await saleRepo.save(sale);

      // insertar items vinculados
      const itemsToInsert: SaleItem[] = [];
      for (const it of dto.items) {
        itemsToInsert.push(
          itemRepo.create({
            sale: { id: savedSale.id } as Sale,
            product: { id: it.productId } as Product,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
          }),
        );
      }
      if (itemsToInsert.length) {
        await itemRepo.save(itemsToInsert);
      }

      if (consumeInv) {
        for (const req of dto.items) {
          const product = productMap.get(req.productId);
          if (!product) throw new NotFoundException(`Producto ${req.productId} no encontrado`);
          // cargar batches y consumir FEFO
          const batches = await trx.getRepository(StockBatch).find({ where: { product: { id: product.id } } });
          const ordered = this.sortBatchesFEFO(batches);
          const totalAvailable = ordered.reduce((sum, b) => sum + b.quantity, 0);
          if (totalAvailable < req.quantity) throw new BadRequestException(`Stock insuficiente para ${product.name}`);

          let remaining = req.quantity;
          for (const b of ordered) {
            if (remaining <= 0) break;
            const take = Math.min(b.quantity, remaining);
            if (take <= 0) continue;
            b.quantity -= take;
            await trx.getRepository(StockBatch).save(b);
            const move = trx.getRepository(StockMovement).create({
              product: { id: product.id } as Product,
              batch: b,
              type: 'CONSUMPTION',
              quantity: -take,
              note: dto.note ?? null,
              refType: 'Sale',
              refId: savedSale.id,
            });
            await trx.getRepository(StockMovement).save(move);
            remaining -= take;
          }
        }
      }

      return savedSale;
    });

    const reloaded = await this.sales.findOne({
      where: { id: saved.id },
      relations: { items: { product: true } },
    });
    if (!reloaded)
      throw new NotFoundException('Venta no encontrada luego de crear');
    return {
      id: reloaded.id,
      createdAt: reloaded.createdAt,
      note: reloaded.note ?? null,
      items: reloaded.items,
      total: reloaded.items
        .reduce((acc, it) => acc + Number(it.unitPrice) * it.quantity, 0)
        .toFixed(2),
    };
  }

  async get(id: number) {
    const s = await this.sales.findOne({
      where: { id },
      relations: { items: { product: true } },
    });
    if (!s) throw new NotFoundException('Venta no encontrada');
    return {
      id: s.id,
      createdAt: s.createdAt,
      note: s.note ?? null,
      items: s.items,
      total: s.items
        .reduce((acc, it) => acc + Number(it.unitPrice) * it.quantity, 0)
        .toFixed(2),
    };
  }

  async list(from?: string, to?: string, page = 1, pageSize = 10) {
    const qb = this.sales
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.items', 'i')
      .leftJoinAndSelect('i.product', 'p')
      .orderBy('s.createdAt', 'DESC');

    if (from) qb.andWhere('s.createdAt >= :from', { from: new Date(from) });
    if (to) {
      const toEnd = new Date(to);
      toEnd.setHours(23, 59, 59, 999);
      qb.andWhere('s.createdAt <= :to', { to: toEnd });
    }

    const totalItems = await qb.getCount();
    const items = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();
    const mapped = items.map((s) => ({
      id: s.id,
      createdAt: s.createdAt,
      note: s.note ?? null,
      items: s.items,
      total: s.items
        .reduce((acc, it) => acc + Number(it.unitPrice) * it.quantity, 0)
        .toFixed(2),
    }));
    return {
      items: mapped,
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }

  async summary(from?: string, to?: string) {
    const qb = this.sales
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.items', 'i')
      .leftJoinAndSelect('i.product', 'p')
      .orderBy('s.createdAt', 'DESC');

    if (from) qb.andWhere('s.createdAt >= :from', { from: new Date(from) });
    if (to) {
      const toEnd = new Date(to);
      toEnd.setHours(23, 59, 59, 999);
      qb.andWhere('s.createdAt <= :to', { to: toEnd });
    }

    const sales = await qb.getMany();

    const totalSales = sales.length;
    const totals = sales.map((s) =>
      s.items.reduce((acc, it) => acc + Number(it.unitPrice) * it.quantity, 0),
    );
    const totalRevenueNum = totals.reduce((a, b) => a + b, 0);
    const avgTicketNum = totalSales ? totalRevenueNum / totalSales : 0;

    // by day
    const byDayMap = new Map<string, { revenue: number; count: number }>();
    for (const s of sales) {
      const day = s.createdAt.toISOString().slice(0, 10);
      const amount = s.items.reduce(
        (acc, it) => acc + Number(it.unitPrice) * it.quantity,
        0,
      );
      const prev = byDayMap.get(day) || { revenue: 0, count: 0 };
      prev.revenue += amount;
      prev.count += 1;
      byDayMap.set(day, prev);
    }
    const byDay = Array.from(byDayMap.entries())
      .map(([date, v]) => ({
        date,
        revenue: v.revenue.toFixed(2),
        count: v.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // top products by revenue
    const topMap = new Map<
      number,
      { name: string; quantity: number; revenue: number }
    >();
    for (const s of sales) {
      for (const it of s.items) {
        const key = it.product.id;
        const prev = topMap.get(key) || {
          name: it.product.name,
          quantity: 0,
          revenue: 0,
        };
        prev.quantity += it.quantity;
        prev.revenue += Number(it.unitPrice) * it.quantity;
        topMap.set(key, prev);
      }
    }
    const topProducts = Array.from(topMap.entries())
      .map(([productId, v]) => ({
        productId,
        name: v.name,
        quantity: v.quantity,
        revenue: v.revenue.toFixed(2),
      }))
      .sort((a, b) => Number(b.revenue) - Number(a.revenue))
      .slice(0, 5);

    return {
      totalRevenue: totalRevenueNum.toFixed(2),
      totalSales,
      avgTicket: avgTicketNum.toFixed(2),
      byDay,
      topProducts,
    };
  }
}
