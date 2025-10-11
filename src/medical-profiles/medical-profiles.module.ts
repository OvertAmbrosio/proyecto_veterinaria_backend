import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetMedicalProfile } from './pet-medical-profile.entity.js';
import { MedicalProfilesService } from './medical-profiles.service.js';
import { MedicalProfilesController } from './medical-profiles.controller.js';
import { Pet } from '../pets/pet.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([PetMedicalProfile, Pet])],
  providers: [MedicalProfilesService],
  controllers: [MedicalProfilesController],
  exports: [MedicalProfilesService, TypeOrmModule],
})
export class MedicalProfilesModule {}
