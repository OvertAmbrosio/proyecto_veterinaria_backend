import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class AdjustDto {
  @IsInt()
  @Min(1)
  productId: number;

  @IsInt()
  // puede ser negativo (OUT) o positivo (IN), validaremos signo en servicio
  quantity: number;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  lotNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string;
}
