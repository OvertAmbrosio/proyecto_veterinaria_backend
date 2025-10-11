import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateOwnerDto {
  @IsString()
  @MaxLength(160)
  name: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;
}
