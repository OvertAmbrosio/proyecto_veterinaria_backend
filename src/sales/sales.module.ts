import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './sale.entity';
import { SaleItem } from './sale-item.entity';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Product } from '../inventory/product.entity';
import { StockBatch } from '../inventory/stock-batch.entity';
import { StockMovement } from '../inventory/stock-movement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sale,
      SaleItem,
      Product,
      StockBatch,
      StockMovement,
    ]),
  ],
  providers: [SalesService],
  controllers: [SalesController],
})
export class SalesModule {}
