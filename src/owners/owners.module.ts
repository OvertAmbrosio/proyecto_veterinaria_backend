import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './owner.entity.js';
import { OwnersService } from './owners.service.js';
import { OwnersController } from './owners.controller.js';
import { Pet } from '../pets/pet.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Owner, Pet])],
  providers: [OwnersService],
  controllers: [OwnersController],
  exports: [OwnersService, TypeOrmModule],
})
export class OwnersModule {}
