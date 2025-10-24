import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64 })
  sku: string;

  @Index()
  @Column({ type: 'varchar', length: 160 })
  name: string;

  // Category y unit como varchar para evitar tipos ENUM de Postgres en v1
  @Column({ type: 'varchar', length: 24 })
  category: 'MEDICINE' | 'SUPPLY' | 'FOOD' | 'OTHER';

  @Column({ type: 'varchar', length: 24 })
  unit: 'EA' | 'ML' | 'G' | 'TABLET';

  @Column({ type: 'boolean', default: false })
  trackLot: boolean;

  @Column({ type: 'integer', nullable: true })
  minStock?: number | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
