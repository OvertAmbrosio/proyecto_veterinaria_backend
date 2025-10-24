import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  sku?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  name?: string;

  @IsOptional()
  @IsString()
  @IsIn(['MEDICINE', 'SUPPLY', 'FOOD', 'OTHER'])
  category?: 'MEDICINE' | 'SUPPLY' | 'FOOD' | 'OTHER';

  @IsOptional()
  @IsString()
  @IsIn(['EA', 'ML', 'G', 'TABLET'])
  unit?: 'EA' | 'ML' | 'G' | 'TABLET';

  @IsOptional()
  @IsBoolean()
  trackLot?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  minStock?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
