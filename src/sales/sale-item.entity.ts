import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from '../inventory/product.entity';

@Entity()
export class SaleItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Sale, (s) => s.items, { onDelete: 'CASCADE' })
  sale!: Sale;

  @ManyToOne(() => Product)
  product!: Product;

  @Column('integer')
  quantity!: number;

  @Column('numeric', { precision: 12, scale: 2 })
  unitPrice!: string;
}
