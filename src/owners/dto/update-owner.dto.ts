import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateOwnerDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  documentNumber?: string;
}
