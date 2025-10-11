import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Veterinarian } from './veterinarian.entity.js';
import { VeterinariansService } from './veterinarians.service.js';
import { VeterinariansController } from './veterinarians.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Veterinarian])],
  providers: [VeterinariansService],
  controllers: [VeterinariansController],
  exports: [VeterinariansService, TypeOrmModule],
})
export class VeterinariansModule {}
