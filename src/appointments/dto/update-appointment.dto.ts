import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentPriority, AppointmentStatus } from '../appointment.entity';

export class UpdateAppointmentDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  petId?: number;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsEnum(AppointmentPriority)
  priority?: AppointmentPriority;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  durationMin?: number;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  veterinarianName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  veterinarianId?: number;
}
