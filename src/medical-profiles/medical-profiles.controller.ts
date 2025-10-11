import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { MedicalProfilesService } from './medical-profiles.service.js';
import { CreateMedicalProfileDto } from './dto/create-medical-profile.dto.js';
import { UpdateMedicalProfileDto } from './dto/update-medical-profile.dto.js';

@Controller('medical-profiles')
export class MedicalProfilesController {
  constructor(private readonly profiles: MedicalProfilesService) {}

  @Get('pet/:petId')
  @HttpCode(HttpStatus.OK)
  getByPet(@Param('petId', ParseIntPipe) petId: number) {
    return this.profiles.getByPet(petId);
  }

  @Put('pet/:petId')
  @HttpCode(HttpStatus.OK)
  upsertForPet(
    @Param('petId', ParseIntPipe) petId: number,
    @Body() dto: CreateMedicalProfileDto | UpdateMedicalProfileDto,
  ) {
    return this.profiles.upsertForPet(petId, dto);
  }
}
