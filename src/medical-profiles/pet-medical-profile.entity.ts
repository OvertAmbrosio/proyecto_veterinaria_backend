import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pet } from '../pets/pet.entity.js';

@Entity('pet_medical_profiles')
export class PetMedicalProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Pet, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @Column({ type: 'text', nullable: true })
  allergies?: string | null;

  @Column({ type: 'text', nullable: true })
  hereditaryIssues?: string | null;

  @Column({ type: 'text', nullable: true })
  behavioralNotes?: string | null;

  @Column({ type: 'text', nullable: true })
  chronicConditions?: string | null;

  @Column({ type: 'text', nullable: true })
  medications?: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  bloodType?: string | null;

  @Column({ type: 'boolean', nullable: true })
  sterilized?: boolean | null;

  @Column({ type: 'date', nullable: true })
  lastDewormingAt?: Date | null;

  @Column({ type: 'text', nullable: true })
  vaccineNotes?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
