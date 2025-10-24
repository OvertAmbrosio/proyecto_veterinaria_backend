import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './owner.entity';
import { OwnersService } from './owners.service';
import { OwnersController } from './owners.controller';
import { Pet } from '../pets/pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Owner, Pet])],
  providers: [OwnersService],
  controllers: [OwnersController],
  exports: [OwnersService, TypeOrmModule],
})
export class OwnersModule {}
