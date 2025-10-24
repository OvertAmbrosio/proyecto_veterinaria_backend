import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { StockBatch } from './stock-batch.entity';
import { StockMovement } from './stock-movement.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { ClinicalHistoryModule } from '../clinical-history/clinical-history.module';
import { Appointment } from '../appointments/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, StockBatch, StockMovement, Appointment]),
    ClinicalHistoryModule,
  ],
  providers: [ProductsService, InventoryService],
  controllers: [ProductsController, InventoryController],
  exports: [TypeOrmModule, ProductsService, InventoryService],
})
export class InventoryModule {}
