import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import appConfig from './config/app.config.js';
import { DatabaseModule } from './database/database.module.js';
import { validateEnv } from './config/validate-env.js';
import { OwnersModule } from './owners/owners.module.js';
import { PetsModule } from './pets/pets.module.js';
import { AppointmentsModule } from './appointments/appointments.module.js';
import { ClinicalRecordsModule } from './clinical-records/clinical-records.module.js';
import { MedicalProfilesModule } from './medical-profiles/medical-profiles.module.js';
import { VeterinariansModule } from './veterinarians/veterinarians.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig],
      validate: validateEnv,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    OwnersModule,
    PetsModule,
    AppointmentsModule,
    ClinicalRecordsModule,
    MedicalProfilesModule,
    VeterinariansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
