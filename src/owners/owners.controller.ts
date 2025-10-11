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
import { OwnersService } from './owners.service.js';
import { CreateOwnerDto } from './dto/create-owner.dto.js';
import { UpdateOwnerDto } from './dto/update-owner.dto.js';

@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateOwnerDto) {
    return this.ownersService.create(dto);
  }

  @Get()
  findAll() {
    return this.ownersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ownersService.findOne(id);
  }

  @Get(':id/pets')
  findPets(@Param('id', ParseIntPipe) id: number) {
    return this.ownersService.findPetsByOwner(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOwnerDto) {
    return this.ownersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.ownersService.remove(id);
    return;
  }
}
