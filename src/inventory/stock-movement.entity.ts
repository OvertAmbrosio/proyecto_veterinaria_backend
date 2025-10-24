import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Product } from './product.entity';
import { StockBatch } from './stock-batch.entity';

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => StockBatch, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'batch_id' })
  batch?: StockBatch | null;

  @Index()
  @Column({ type: 'varchar', length: 24 })
  type:
    | 'PURCHASE'
    | 'CONSUMPTION'
    | 'ADJUSTMENT_IN'
    | 'ADJUSTMENT_OUT'
    | 'WRITE_OFF';

  @Column({ type: 'integer' })
  quantity: number; // IN: positivo, OUT: negativo

  @Column({ type: 'varchar', length: 255, nullable: true })
  note?: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  refType?: 'Appointment' | 'Manual' | 'Sale' | null;

  @Column({ type: 'int', nullable: true })
  refId?: number | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
