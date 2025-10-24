import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(
    dto: CreateUserDto,
  ): Promise<Pick<User, 'id' | 'email' | 'name' | 'createdAt'>> {
    const exists = await this.usersRepo.findOne({
      where: { email: dto.email.toLowerCase() },
    });
    if (exists) throw new ConflictException('Email ya registrado');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      email: dto.email.toLowerCase(),
      name: dto.name,
      passwordHash,
    });
    const saved = await this.usersRepo.save(user);
    return {
      id: saved.id,
      email: saved.email,
      name: saved.name,
      createdAt: saved.createdAt,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email: email.toLowerCase() } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async setRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.usersRepo.update({ id: userId }, { refreshTokenHash });
  }

  async removeRefreshToken(userId: number): Promise<void> {
    await this.usersRepo.update({ id: userId }, { refreshTokenHash: null });
  }
}
