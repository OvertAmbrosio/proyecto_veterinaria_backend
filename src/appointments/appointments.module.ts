import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity.js';
import { Pet } from '../pets/pet.entity.js';
import { ClinicalHistoryModule } from '../clinical-history/clinical-history.module.js';
import { AppointmentsService } from './appointments.service.js';
import { AppointmentsController } from './appointments.controller.js';
import { Veterinarian } from '../veterinarians/veterinarian.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Pet, Veterinarian]),
    ClinicalHistoryModule,
  ],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
  exports: [AppointmentsService, TypeOrmModule],
})
export class AppointmentsModule {}
