import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalRecordEntry } from './clinical-record-entry.entity.js';
import { ClinicalRecordsService } from './clinical-records.service.js';
import { ClinicalRecordsController } from './clinical-records.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicalRecordEntry])],
  providers: [ClinicalRecordsService],
  controllers: [ClinicalRecordsController],
  exports: [ClinicalRecordsService, TypeOrmModule],
})
export class ClinicalRecordsModule {}
