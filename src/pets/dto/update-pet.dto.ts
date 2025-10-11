import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePetDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  ownerId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  species?: string;

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
