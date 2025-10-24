import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { Owner } from '../owners/owner.entity';

@Entity('pets')
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  breed?: string | null;

  @Index()
  @Column({ type: 'varchar', length: 80 })
  species: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl?: string | null;

  @Column({ type: 'float', nullable: true })
  weightKg?: number | null;

  @Column({ type: 'float', nullable: true })
  heightCm?: number | null;

  @Column({ type: 'date', nullable: true })
  birthDate?: Date | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  sex?: string | null;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @ManyToOne(() => Owner, (owner) => owner.pets, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner_id' })
  owner: Owner;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
