import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetMedicalProfile } from './pet-medical-profile.entity';
import { Pet } from '../pets/pet.entity';
import { CreateMedicalProfileDto } from './dto/create-medical-profile.dto';
import { UpdateMedicalProfileDto } from './dto/update-medical-profile.dto';

@Injectable()
export class MedicalProfilesService {
  constructor(
    @InjectRepository(PetMedicalProfile)
    private readonly profilesRepo: Repository<PetMedicalProfile>,
    @InjectRepository(Pet)
    private readonly petsRepo: Repository<Pet>,
  ) {}

  async getByPet(petId: number): Promise<PetMedicalProfile | null> {
    return this.profilesRepo.findOne({ where: { pet: { id: petId } } });
  }

  async upsertForPet(
    petId: number,
    dto: CreateMedicalProfileDto | UpdateMedicalProfileDto,
  ): Promise<PetMedicalProfile> {
    const pet = await this.petsRepo.findOne({ where: { id: petId } });
    if (!pet) throw new NotFoundException('Mascota no encontrada');

    let profile = await this.getByPet(petId);
    if (!profile) {
      profile = this.profilesRepo.create({ pet });
    }
    Object.assign(profile, {
      allergies: dto.allergies ?? profile.allergies ?? null,
      hereditaryIssues:
        dto.hereditaryIssues ?? profile.hereditaryIssues ?? null,
      behavioralNotes: dto.behavioralNotes ?? profile.behavioralNotes ?? null,
      chronicConditions:
        dto.chronicConditions ?? profile.chronicConditions ?? null,
      medications: dto.medications ?? profile.medications ?? null,
      bloodType: dto.bloodType ?? profile.bloodType ?? null,
      sterilized: dto.sterilized ?? profile.sterilized ?? null,
      lastDewormingAt: dto.lastDewormingAt
        ? new Date(dto.lastDewormingAt)
        : (profile.lastDewormingAt ?? null),
      vaccineNotes: dto.vaccineNotes ?? profile.vaccineNotes ?? null,
    });

    return this.profilesRepo.save(profile);
  }
}
