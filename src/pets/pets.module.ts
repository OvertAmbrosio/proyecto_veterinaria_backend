import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './pet.entity.js';
import { PetsService } from './pets.service.js';
import { PetsController } from './pets.controller.js';
import { Owner } from '../owners/owner.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Pet, Owner])],
  providers: [PetsService],
  controllers: [PetsController],
  exports: [PetsService, TypeOrmModule],
})
export class PetsModule {}
