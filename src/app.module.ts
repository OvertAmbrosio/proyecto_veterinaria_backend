import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';
import { DatabaseModule } from './database/database.module';
import { validateEnv } from './config/validate-env';
import { OwnersModule } from './owners/owners.module';
import { PetsModule } from './pets/pets.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ClinicalHistoryModule } from './clinical-history/clinical-history.module';
import { MedicalProfilesModule } from './medical-profiles/medical-profiles.module';
import { VeterinariansModule } from './veterinarians/veterinarians.module';
import { InventoryModule } from './inventory/inventory.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig],
      validate: validateEnv,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    OwnersModule,
    PetsModule,
    AppointmentsModule,
    ClinicalHistoryModule,
    MedicalProfilesModule,
    VeterinariansModule,
    InventoryModule,
    SalesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
