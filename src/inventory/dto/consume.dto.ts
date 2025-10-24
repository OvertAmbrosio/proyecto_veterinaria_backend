import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class ConsumeDto {
  @IsInt()
  @Min(1)
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  appointmentId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string;
}
