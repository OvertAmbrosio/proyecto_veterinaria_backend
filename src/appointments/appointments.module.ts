import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { Pet } from '../pets/pet.entity';
import { ClinicalHistoryModule } from '../clinical-history/clinical-history.module';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Veterinarian } from '../veterinarians/veterinarian.entity';

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
