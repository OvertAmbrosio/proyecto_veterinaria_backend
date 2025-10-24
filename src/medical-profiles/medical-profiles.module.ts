import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetMedicalProfile } from './pet-medical-profile.entity';
import { MedicalProfilesService } from './medical-profiles.service';
import { MedicalProfilesController } from './medical-profiles.controller';
import { Pet } from '../pets/pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PetMedicalProfile, Pet])],
  providers: [MedicalProfilesService],
  controllers: [MedicalProfilesController],
  exports: [MedicalProfilesService, TypeOrmModule],
})
export class MedicalProfilesModule {}
