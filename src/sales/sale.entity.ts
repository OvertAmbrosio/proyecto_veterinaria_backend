import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SaleItem } from './sale-item.entity';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'text', nullable: true })
  note?: string | null;

  @OneToMany(() => SaleItem, (i: SaleItem) => i.sale)
  items!: SaleItem[];
}
