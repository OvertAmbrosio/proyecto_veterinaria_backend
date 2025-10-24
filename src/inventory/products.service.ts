import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const existing = await this.productsRepo.findOne({
      where: { sku: dto.sku },
    });
    if (existing) throw new BadRequestException('SKU ya registrado');
    const p = this.productsRepo.create({ ...dto, isActive: true });
    return this.productsRepo.save(p);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Product> {
    const p = await this.productsRepo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Producto no encontrado');
    return p;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const p = await this.findOne(id);
    if (dto.sku && dto.sku !== p.sku) {
      const duplicated = await this.productsRepo.findOne({
        where: { sku: dto.sku },
      });
      if (duplicated) throw new BadRequestException('SKU ya registrado');
    }
    Object.assign(p, dto);
    return this.productsRepo.save(p);
  }

  async remove(id: number): Promise<void> {
    const p = await this.findOne(id);
    p.isActive = false;
    await this.productsRepo.save(p);
  }
}
