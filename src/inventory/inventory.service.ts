import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, IsNull } from 'typeorm';
import { Product } from './product.entity';
import { StockBatch } from './stock-batch.entity';
import { StockMovement } from './stock-movement.entity';
import { PurchaseDto } from './dto/purchase.dto';
import { ConsumeDto } from './dto/consume.dto';
import { AdjustDto } from './dto/adjust.dto';
import { ClinicalHistoryService } from '../clinical-history/clinical-history.service';
import { ClinicalHistoryCategory } from '../clinical-history/clinical-history.entity';
import { Appointment } from '../appointments/appointment.entity';

@Injectable()
export class InventoryService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
    @InjectRepository(StockBatch)
    private readonly batchesRepo: Repository<StockBatch>,
    @InjectRepository(StockMovement)
    private readonly movesRepo: Repository<StockMovement>,
    @InjectRepository(Appointment)
    private readonly apptRepo: Repository<Appointment>,
    private readonly clinical: ClinicalHistoryService,
  ) {}

  async purchase(dto: PurchaseDto) {
    if (!dto.items?.length) throw new BadRequestException('Sin items');
    return this.dataSource.transaction(async (trx) => {
      const batches: StockBatch[] = [];
      for (const item of dto.items) {
        const product = await trx
          .getRepository(Product)
          .findOne({ where: { id: item.productId } });
        if (!product)
          throw new NotFoundException(
            `Producto ${item.productId} no encontrado`,
          );
        const requiresLot = !!product.trackLot;
        if (requiresLot && !item.lotNumber)
          throw new BadRequestException(
            'lotNumber requerido para productos con lote',
          );

        const lotKey = requiresLot ? item.lotNumber! : null;
        let batch = await trx.getRepository(StockBatch).findOne({
          where: {
            product: { id: product.id },
            lotNumber: lotKey === null ? IsNull() : lotKey,
          },
        });
        if (!batch) {
          batch = trx.getRepository(StockBatch).create({
            product,
            lotNumber: lotKey,
            expirationDate: item.expirationDate ?? null,
            quantity: 0,
            costPerUnit: item.costPerUnit ?? null,
          });
        }
        batch.quantity += item.quantity;
        await trx.getRepository(StockBatch).save(batch);
        batches.push(batch);

        const move = trx.getRepository(StockMovement).create({
          product,
          batch,
          type: 'PURCHASE',
          quantity: item.quantity,
          note: dto.note ?? null,
          refType: 'Manual',
          refId: null,
        });
        await trx.getRepository(StockMovement).save(move);
      }
      return batches;
    });
  }

  private sortBatchesFEFO(batches: StockBatch[]) {
    const now = new Date();
    return [...batches]
      .filter((b) => b.quantity > 0)
      .sort((a, b) => {
        const aExp = a.expirationDate ? new Date(a.expirationDate) : null;
        const bExp = b.expirationDate ? new Date(b.expirationDate) : null;
        // vencidos al final (no consumimos vencidos)
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
        // empate por creación
        return (
          (a.createdAt?.getTime?.() ?? 0) - (b.createdAt?.getTime?.() ?? 0)
        );
      });
  }

  async consume(dto: ConsumeDto) {
    const product = await this.productsRepo.findOne({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    if (dto.quantity <= 0) throw new BadRequestException('Cantidad inválida');

    const result = await this.dataSource.transaction(async (trx) => {
      const batches = await trx
        .getRepository(StockBatch)
        .find({ where: { product: { id: product.id } } });
      const ordered = this.sortBatchesFEFO(batches);
      const totalAvailable = ordered.reduce((sum, b) => sum + b.quantity, 0);
      if (totalAvailable < dto.quantity)
        throw new BadRequestException('Stock insuficiente');

      let remaining = dto.quantity;
      const movements: { lotNumber: string | null; qty: number }[] = [];

      for (const b of ordered) {
        if (remaining <= 0) break;
        const take = Math.min(b.quantity, remaining);
        if (take <= 0) continue;
        b.quantity -= take;
        await trx.getRepository(StockBatch).save(b);
        const move = trx.getRepository(StockMovement).create({
          product,
          batch: b,
          type: 'CONSUMPTION',
          quantity: -take,
          note: dto.note ?? null,
          refType: dto.appointmentId ? 'Appointment' : 'Manual',
          refId: dto.appointmentId ?? null,
        });
        await trx.getRepository(StockMovement).save(move);
        movements.push({ lotNumber: b.lotNumber ?? null, qty: take });
        remaining -= take;
      }

      return { movements };
    });

    if (dto.appointmentId) {
      const appt = await this.apptRepo.findOne({
        where: { id: dto.appointmentId },
        relations: { pet: true },
      });
      if (appt && appt.pet) {
        // registrar en clinical-history
        await this.clinical.addEntry({
          pet: appt.pet,
          category: ClinicalHistoryCategory.TREATMENT,
          title: `Consumo de producto: ${product.name}`,
          details: dto.note,
          appointment: appt,
          meta: {
            productId: product.id,
            productSku: product.sku,
            productUnit: product.unit,
            totalQty: dto.quantity,
            movements: result.movements,
          },
        });
      }
    }

    return { ok: true };
  }

  async adjust(dto: AdjustDto) {
    const product = await this.productsRepo.findOne({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    if (dto.quantity === 0)
      throw new BadRequestException('Cantidad no puede ser 0');

    return this.dataSource.transaction(async (trx) => {
      const lotKey = product.trackLot ? (dto.lotNumber ?? null) : null;
      if (product.trackLot && !dto.lotNumber)
        throw new BadRequestException(
          'lotNumber requerido para productos con lote',
        );

      let batch = await trx.getRepository(StockBatch).findOne({
        where: {
          product: { id: product.id },
          lotNumber: lotKey === null ? IsNull() : lotKey,
        },
      });
      if (!batch) {
        if (dto.quantity < 0)
          throw new BadRequestException(
            'No existe lote/stock para ajuste negativo',
          );
        batch = trx
          .getRepository(StockBatch)
          .create({ product, lotNumber: lotKey, quantity: 0 });
      }

      const newQty = batch.quantity + dto.quantity;
      if (newQty < 0)
        throw new BadRequestException('Stock insuficiente para ajuste');
      batch.quantity = newQty;
      await trx.getRepository(StockBatch).save(batch);

      const type = dto.quantity > 0 ? 'ADJUSTMENT_IN' : 'ADJUSTMENT_OUT';
      const move = trx.getRepository(StockMovement).create({
        product,
        batch,
        type,
        quantity: dto.quantity,
        note: dto.note ?? null,
        refType: 'Manual',
        refId: null,
      });
      await trx.getRepository(StockMovement).save(move);

      return batch;
    });
  }

  async stock(productId: number) {
    const product = await this.productsRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    const batches = await this.batchesRepo.find({
      where: { product: { id: productId } },
    });
    const total = batches.reduce((s, b) => s + b.quantity, 0);
    return { product, total, batches };
  }

  async batches(productId: number) {
    const product = await this.productsRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return this.batchesRepo.find({
      where: { product: { id: productId } },
      order: { expirationDate: 'ASC', createdAt: 'ASC' },
    });
  }
}
