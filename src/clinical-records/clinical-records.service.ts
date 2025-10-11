import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ClinicalRecordEntry,
  ClinicalRecordCategory,
} from './clinical-record-entry.entity.js';
import { Pet } from '../pets/pet.entity.js';
import { Appointment } from '../appointments/appointment.entity.js';

@Injectable()
export class ClinicalRecordsService {
  constructor(
    @InjectRepository(ClinicalRecordEntry)
    private readonly recordsRepo: Repository<ClinicalRecordEntry>,
  ) {}

  async addEntry(params: {
    pet: Pet;
    category: ClinicalRecordCategory;
    title: string;
    details?: string;
    appointment?: Appointment | null;
    meta?: Record<string, unknown> | null;
  }): Promise<ClinicalRecordEntry> {
    const entry = this.recordsRepo.create({
      pet: params.pet,
      category: params.category,
      title: params.title,
      details: params.details,
      appointment: params.appointment ?? null,
      meta: params.meta ?? null,
    });
    return this.recordsRepo.save(entry);
  }

  async findByPet(petId: number): Promise<ClinicalRecordEntry[]> {
    return this.recordsRepo.find({
      where: { pet: { id: petId } },
      order: { createdAt: 'DESC' },
      relations: { appointment: true },
    });
  }
}
