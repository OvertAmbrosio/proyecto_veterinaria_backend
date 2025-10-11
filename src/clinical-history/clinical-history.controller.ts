import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ClinicalHistoryService } from './clinical-history.service.js';

@Controller('clinical-history')
export class ClinicalHistoryController {
  constructor(private readonly history: ClinicalHistoryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findByPet(@Query('petId') petId?: string) {
    if (!petId) return [];
    const id = Number(petId);
    if (Number.isNaN(id)) return [];
    return this.history.findByPet(id);
  }

  @Get('pet/:petId')
  @HttpCode(HttpStatus.OK)
  findByPetParam(@Param('petId', ParseIntPipe) petId: number) {
    return this.history.findByPet(petId);
  }
}
