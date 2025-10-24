import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Veterinarian } from './veterinarian.entity';
import { CreateVeterinarianDto } from './dto/create-veterinarian.dto';
import { UpdateVeterinarianDto } from './dto/update-veterinarian.dto';

@Injectable()
export class VeterinariansService {
  constructor(
    @InjectRepository(Veterinarian)
    private readonly vetsRepo: Repository<Veterinarian>,
  ) {}

  async create(dto: CreateVeterinarianDto): Promise<Veterinarian> {
    const vet = this.vetsRepo.create(dto);
    return this.vetsRepo.save(vet);
  }

  async findAll(): Promise<Veterinarian[]> {
    return this.vetsRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<Veterinarian> {
    const vet = await this.vetsRepo.findOne({ where: { id } });
    if (!vet) throw new NotFoundException('Veterinario no encontrado');
    return vet;
  }

  async update(id: number, dto: UpdateVeterinarianDto): Promise<Veterinarian> {
    const vet = await this.findOne(id);
    Object.assign(vet, dto);
    return this.vetsRepo.save(vet);
  }

  async remove(id: number): Promise<void> {
    const vet = await this.findOne(id);
    await this.vetsRepo.remove(vet);
  }
}
