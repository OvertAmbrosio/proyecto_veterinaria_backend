import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Appointment,
  AppointmentPriority,
  AppointmentStatus,
} from './appointment.entity.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { UpdateAppointmentDto } from './dto/update-appointment.dto.js';
import { Pet } from '../pets/pet.entity.js';
import { ClinicalRecordsService } from '../clinical-records/clinical-records.service.js';
import { ClinicalRecordCategory } from '../clinical-records/clinical-record-entry.entity.js';
import { Veterinarian } from '../veterinarians/veterinarian.entity.js';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly apptRepo: Repository<Appointment>,
    @InjectRepository(Pet)
    private readonly petsRepo: Repository<Pet>,
    @InjectRepository(Veterinarian)
    private readonly vetsRepo: Repository<Veterinarian>,
    private readonly records: ClinicalRecordsService,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const pet = await this.petsRepo.findOne({ where: { id: dto.petId } });
    if (!pet) throw new NotFoundException('Mascota no encontrada');

    let veterinarian: Veterinarian | undefined;
    if (dto.veterinarianId) {
      const vet = await this.vetsRepo.findOne({
        where: { id: dto.veterinarianId },
      });
      if (!vet) throw new NotFoundException('Veterinario no encontrado');
      veterinarian = vet;
    }

    const appt = this.apptRepo.create({
      pet,
      scheduledAt: new Date(dto.scheduledAt),
      priority: dto.priority ?? AppointmentPriority.MEDIUM,
      reason: dto.reason,
      notes: dto.notes,
      durationMin: dto.durationMin,
      veterinarian: veterinarian ?? null,
      status: AppointmentStatus.PENDING,
    });
    const saved = await this.apptRepo.save(appt);

    await this.records.addEntry({
      pet,
      category: ClinicalRecordCategory.APPOINTMENT,
      title: `Nueva cita (${saved.priority})`,
      details: `Motivo: ${saved.reason}`,
      appointment: saved,
      meta: { status: saved.status },
    });

    return saved;
  }

  async findAll(petId?: number): Promise<Appointment[]> {
    if (petId) {
      return this.apptRepo.find({
        where: { pet: { id: petId } },
        relations: { pet: true, veterinarian: true },
        order: { scheduledAt: 'DESC' },
      });
    }
    return this.apptRepo.find({
      relations: { pet: true, veterinarian: true },
      order: { scheduledAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appt = await this.apptRepo.findOne({
      where: { id },
      relations: { pet: true, veterinarian: true },
    });
    if (!appt) throw new NotFoundException('Cita no encontrada');
    return appt;
  }

  async update(id: number, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appt = await this.apptRepo.findOne({
      where: { id },
      relations: { pet: true, veterinarian: true },
    });
    if (!appt) throw new NotFoundException('Cita no encontrada');

    if (dto.petId) {
      const pet = await this.petsRepo.findOne({ where: { id: dto.petId } });
      if (!pet) throw new NotFoundException('Mascota no encontrada');
      appt.pet = pet;
    }

    if (dto.veterinarianId) {
      const vet = await this.vetsRepo.findOne({
        where: { id: dto.veterinarianId },
      });
      if (!vet) throw new NotFoundException('Veterinario no encontrado');
      appt.veterinarian = vet;
    }

    const prevStatus = appt.status;

    Object.assign(appt, {
      scheduledAt: dto.scheduledAt
        ? new Date(dto.scheduledAt)
        : appt.scheduledAt,
      status: dto.status ?? appt.status,
      priority: dto.priority ?? appt.priority,
      reason: dto.reason ?? appt.reason,
      notes: dto.notes ?? appt.notes,
      durationMin: dto.durationMin ?? appt.durationMin,
    });

    const saved = await this.apptRepo.save(appt);

    if (dto.status && dto.status !== prevStatus) {
      await this.records.addEntry({
        pet: saved.pet,
        appointment: saved,
        category: ClinicalRecordCategory.STATUS_CHANGE,
        title: `Cambio de estado: ${prevStatus} -> ${saved.status}`,
        details: dto.notes,
        meta: { from: prevStatus, to: saved.status },
      });
    }

    return saved;
  }

  async remove(id: number): Promise<void> {
    const appt = await this.apptRepo.findOne({ where: { id } });
    if (!appt) throw new NotFoundException('Cita no encontrada');
    await this.apptRepo.remove(appt);
  }
}
