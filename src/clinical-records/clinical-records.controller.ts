import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ClinicalRecordsService } from './clinical-records.service.js';

@Controller('clinical-records')
export class ClinicalRecordsController {
  constructor(private readonly records: ClinicalRecordsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findByPet(@Query('petId') petId?: string) {
    if (!petId) return [];
    const id = Number(petId);
    if (Number.isNaN(id)) return [];
    return this.records.findByPet(id);
  }

  @Get('pet/:petId')
  @HttpCode(HttpStatus.OK)
  findByPetParam(@Param('petId', ParseIntPipe) petId: number) {
    return this.records.findByPet(petId);
  }
}
