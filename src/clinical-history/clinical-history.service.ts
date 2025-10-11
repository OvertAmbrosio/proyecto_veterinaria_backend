import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ClinicalHistory,
  ClinicalHistoryCategory,
} from './clinical-history.entity.js';
import { Pet } from '../pets/pet.entity.js';
import { Appointment } from '../appointments/appointment.entity.js';

@Injectable()
export class ClinicalHistoryService {
  constructor(
    @InjectRepository(ClinicalHistory)
    private readonly historyRepo: Repository<ClinicalHistory>,
  ) {}

  async addEntry(params: {
    pet: Pet;
    category: ClinicalHistoryCategory;
    title: string;
    details?: string;
    appointment?: Appointment | null;
    meta?: Record<string, unknown> | null;
  }): Promise<ClinicalHistory> {
    const entry = this.historyRepo.create({
      pet: params.pet,
      category: params.category,
      title: params.title,
      details: params.details,
      appointment: params.appointment ?? null,
      meta: params.meta ?? null,
    });
    return this.historyRepo.save(entry);
  }

  async findByPet(petId: number): Promise<ClinicalHistory[]> {
    return this.historyRepo.find({
      where: { pet: { id: petId } },
      order: { createdAt: 'DESC' },
      relations: { appointment: true },
    });
  }
}
