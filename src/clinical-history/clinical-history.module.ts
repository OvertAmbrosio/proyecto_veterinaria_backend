import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalHistory } from './clinical-history.entity';
import { ClinicalHistoryService } from './clinical-history.service';
import { ClinicalHistoryController } from './clinical-history.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicalHistory])],
  providers: [ClinicalHistoryService],
  controllers: [ClinicalHistoryController],
  exports: [ClinicalHistoryService, TypeOrmModule],
})
export class ClinicalHistoryModule {}
