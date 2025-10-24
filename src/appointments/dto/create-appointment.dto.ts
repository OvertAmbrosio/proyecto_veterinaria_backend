import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentPriority } from '../appointment.entity';

export class CreateAppointmentDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  petId: number;

  @IsDateString()
  scheduledAt: string;

  @IsEnum(AppointmentPriority)
  @IsOptional()
  priority?: AppointmentPriority;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reason: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  durationMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  veterinarianId?: number;
}
