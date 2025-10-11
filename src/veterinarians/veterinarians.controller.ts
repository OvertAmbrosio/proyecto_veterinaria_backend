import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { VeterinariansService } from './veterinarians.service.js';
import { CreateVeterinarianDto } from './dto/create-veterinarian.dto.js';
import { UpdateVeterinarianDto } from './dto/update-veterinarian.dto.js';

@Controller('veterinarians')
export class VeterinariansController {
  constructor(private readonly vets: VeterinariansService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateVeterinarianDto) {
    return this.vets.create(dto);
  }

  @Get()
  findAll() {
    return this.vets.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vets.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVeterinarianDto,
  ) {
    return this.vets.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.vets.remove(id);
  }
}
