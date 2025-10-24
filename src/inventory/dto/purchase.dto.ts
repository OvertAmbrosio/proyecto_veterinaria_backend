import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class PurchaseItemDto {
  @IsInt()
  @Min(1)
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  // Guardamos costo como string para mantener precisión en numeric
  @IsOptional()
  @IsNumberString()
  costPerUnit?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  lotNumber?: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}

export class PurchaseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items: PurchaseItemDto[];

  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string;
}
