import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from './owner.entity';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { Pet } from '../pets/pet.entity';

@Injectable()
export class OwnersService {
  constructor(
    @InjectRepository(Owner)
    private readonly ownersRepo: Repository<Owner>,
    @InjectRepository(Pet)
    private readonly petsRepo: Repository<Pet>,
  ) {}

  async create(dto: CreateOwnerDto): Promise<Owner> {
    const owner = this.ownersRepo.create(dto);
    return this.ownersRepo.save(owner);
  }

  async findAll(): Promise<Owner[]> {
    return this.ownersRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Owner> {
    const owner = await this.ownersRepo.findOne({
      where: { id },
      relations: { pets: true },
    });
    if (!owner) throw new NotFoundException('Owner no encontrado');
    return owner;
  }

  async update(id: number, dto: UpdateOwnerDto): Promise<Owner> {
    const owner = await this.ownersRepo.findOne({ where: { id } });
    if (!owner) throw new NotFoundException('Owner no encontrado');
    if (!dto || Object.keys(dto).length === 0) {
      // sin cambios: devolver entidad actual para evitar update vacío
      return owner;
    }
    Object.assign(owner, dto);
    return this.ownersRepo.save(owner);
  }

  async remove(id: number): Promise<void> {
    const found = await this.ownersRepo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Owner no encontrado');
    await this.ownersRepo.remove(found);
  }

  async findPetsByOwner(ownerId: number): Promise<Pet[]> {
    const owner = await this.ownersRepo.findOne({ where: { id: ownerId } });
    if (!owner) throw new NotFoundException('Owner no encontrado');
    return this.petsRepo.find({
      where: { owner: { id: ownerId } },
      order: { createdAt: 'DESC' },
    });
  }
}
