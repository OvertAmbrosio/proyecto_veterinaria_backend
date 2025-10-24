import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Pet } from '../pets/pet.entity';
import { Appointment } from '../appointments/appointment.entity';

export enum ClinicalHistoryCategory {
  APPOINTMENT = 'APPOINTMENT',
  STATUS_CHANGE = 'STATUS_CHANGE',
  NOTE = 'NOTE',
  DIAGNOSIS = 'DIAGNOSIS',
  TREATMENT = 'TREATMENT',
}

@Entity('clinical_histories')
export class ClinicalHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pet, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @ManyToOne(() => Appointment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'appointment_id' })
  appointment?: Appointment | null;

  @Index()
  @Column({
    type: 'enum',
    enum: ClinicalHistoryCategory,
  })
  category: ClinicalHistoryCategory;

  @Column({ type: 'varchar', length: 160 })
  title: string;

  @Column({ type: 'text', nullable: true })
  details?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  meta?: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
