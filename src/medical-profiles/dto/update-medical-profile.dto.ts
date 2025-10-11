import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateMedicalProfileDto {
  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  hereditaryIssues?: string;

  @IsOptional()
  @IsString()
  behavioralNotes?: string;

  @IsOptional()
  @IsString()
  chronicConditions?: string;

  @IsOptional()
  @IsString()
  medications?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  bloodType?: string;

  @IsOptional()
  @IsBoolean()
  sterilized?: boolean;

  @IsOptional()
  @IsDateString()
  lastDewormingAt?: string;

  @IsOptional()
  @IsString()
  vaccineNotes?: string;
}
