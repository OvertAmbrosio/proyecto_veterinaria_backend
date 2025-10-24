import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './pet.entity';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { Owner } from '../owners/owner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pet, Owner])],
  providers: [PetsService],
  controllers: [PetsController],
  exports: [PetsService, TypeOrmModule],
})
export class PetsModule {}
