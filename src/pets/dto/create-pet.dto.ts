import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePetDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  ownerId: number;

  @IsString()
  @MaxLength(120)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(80)
  @IsNotEmpty()
  species: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  breed?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  imageUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  weightKg?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  heightCm?: number;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  sex?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
