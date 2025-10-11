import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalHistory } from './clinical-history.entity.js';
import { ClinicalHistoryService } from './clinical-history.service.js';
import { ClinicalHistoryController } from './clinical-history.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicalHistory])],
  providers: [ClinicalHistoryService],
  controllers: [ClinicalHistoryController],
  exports: [ClinicalHistoryService, TypeOrmModule],
})
export class ClinicalHistoryModule {}
