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

@Entity('stock_batches')
@Index('UQ_product_lot', ['product', 'lotNumber'], { unique: true })
export class StockBatch {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'varchar', length: 64, nullable: true })
  lotNumber?: string | null;

  @Column({ type: 'date', nullable: true })
  expirationDate?: string | null;

  @Column({ type: 'integer', default: 0 })
  quantity: number;

  @Column({ type: 'numeric', nullable: true })
  costPerUnit?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
