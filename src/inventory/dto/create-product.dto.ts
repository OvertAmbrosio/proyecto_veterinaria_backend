import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(64)
  sku: string;

  @IsString()
  @MaxLength(160)
  name: string;

  @IsString()
  @IsIn(['MEDICINE', 'SUPPLY', 'FOOD', 'OTHER'])
  category: 'MEDICINE' | 'SUPPLY' | 'FOOD' | 'OTHER';

  @IsString()
  @IsIn(['EA', 'ML', 'G', 'TABLET'])
  unit: 'EA' | 'ML' | 'G' | 'TABLET';

  @IsBoolean()
  trackLot: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  minStock?: number;
}
