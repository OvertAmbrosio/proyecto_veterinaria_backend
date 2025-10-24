import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Veterinarian } from './veterinarian.entity';
import { VeterinariansService } from './veterinarians.service';
import { VeterinariansController } from './veterinarians.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Veterinarian])],
  providers: [VeterinariansService],
  controllers: [VeterinariansController],
  exports: [VeterinariansService, TypeOrmModule],
})
export class VeterinariansModule {}
