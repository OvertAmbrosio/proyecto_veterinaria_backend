import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Appointment } from '../appointments/appointment.entity.js';

@Entity('veterinarians')
export class Veterinarian {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 160 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string | null;

  @Column({ type: 'varchar', length: 40, nullable: true })
  phone?: string | null;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  licenseNumber?: string | null;

  @Column({ type: 'simple-array', nullable: true })
  specialties?: string[] | null;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @OneToMany(() => Appointment, (appt) => appt.veterinarian)
  appointments?: Appointment[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
