import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class EnvironmentVariables {
  @IsEnum(['development', 'production', 'test', 'local'])
  @IsOptional()
  NODE_ENV: 'development' | 'production' | 'test' | 'local' = 'development';

  @IsNumber()
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  DATABASE_URL!: string;

  @IsString()
  JWT_ACCESS_SECRET!: string;

  @IsString()
  JWT_REFRESH_SECRET!: string;
}
