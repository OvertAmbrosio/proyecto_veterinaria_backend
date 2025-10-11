import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from './pet.entity.js';
import { CreatePetDto } from './dto/create-pet.dto.js';
import { UpdatePetDto } from './dto/update-pet.dto.js';
import { Owner } from '../owners/owner.entity.js';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private readonly petsRepo: Repository<Pet>,
    @InjectRepository(Owner)
    private readonly ownersRepo: Repository<Owner>,
  ) {}

  async create(dto: CreatePetDto): Promise<Pet> {
    const owner = await this.ownersRepo.findOne({ where: { id: dto.ownerId } });
    if (!owner) throw new NotFoundException('Owner no encontrado');

    const pet = this.petsRepo.create({
      name: dto.name,
      species: dto.species,
      breed: dto.breed,
      imageUrl: dto.imageUrl,
      weightKg: dto.weightKg,
      heightCm: dto.heightCm,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      sex: dto.sex,
      notes: dto.notes,
      owner,
    });
    return this.petsRepo.save(pet);
  }

  async findAll(): Promise<Pet[]> {
    return this.petsRepo.find({
      relations: { owner: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByOwner(ownerId: number): Promise<Pet[]> {
    return this.petsRepo.find({
      where: { owner: { id: ownerId } },
      relations: { owner: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Pet> {
    const pet = await this.petsRepo.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!pet) throw new NotFoundException('Pet no encontrado');
    return pet;
  }

  async update(id: number, dto: UpdatePetDto): Promise<Pet> {
    const pet = await this.petsRepo.findOne({ where: { id } });
    if (!pet) throw new NotFoundException('Pet no encontrado');

    if (dto.ownerId) {
      const owner = await this.ownersRepo.findOne({
        where: { id: dto.ownerId },
      });
      if (!owner) throw new NotFoundException('Owner no encontrado');
      pet.owner = owner;
    }

    Object.assign(pet, {
      name: dto.name ?? pet.name,
      species: dto.species ?? pet.species,
      breed: dto.breed ?? pet.breed,
      imageUrl: dto.imageUrl ?? pet.imageUrl,
      weightKg: dto.weightKg ?? pet.weightKg,
      heightCm: dto.heightCm ?? pet.heightCm,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : pet.birthDate,
      sex: dto.sex ?? pet.sex,
      notes: dto.notes ?? pet.notes,
    });

    return this.petsRepo.save(pet);
  }

  async remove(id: number): Promise<void> {
    const pet = await this.petsRepo.findOne({ where: { id } });
    if (!pet) throw new NotFoundException('Pet no encontrado');
    await this.petsRepo.remove(pet);
  }
}
