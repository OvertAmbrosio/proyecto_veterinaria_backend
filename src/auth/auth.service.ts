import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import type { User } from '../users/user.entity.js';
import type { EnvironmentVariables } from '../config/environment.js';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  typ?: 'access' | 'refresh';
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');
    return user;
  }

  private async signAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: String(user.id),
      email: user.email,
      name: user.name,
      typ: 'access',
    };
    const secret =
      this.config.get('JWT_ACCESS_SECRET', { infer: true }) ||
      'dev_access_secret';
    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '15m',
    });
    return token;
  }

  private async signRefreshToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: String(user.id),
      email: user.email,
      name: user.name,
      typ: 'refresh',
    };
    const secret =
      this.config.get('JWT_REFRESH_SECRET', { infer: true }) ||
      'dev_refresh_secret';
    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '7d',
    });
    await this.usersService.setRefreshToken(user.id, token);
    return token;
  }

  async loginWithUser(user: User) {
    const accessToken = await this.signAccessToken(user);
    const refreshToken = await this.signRefreshToken(user);
    return {
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const secret =
        this.config.get('JWT_REFRESH_SECRET', { infer: true }) ||
        'dev_refresh_secret';
      const decoded = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        { secret },
      );
      if (decoded.typ !== 'refresh')
        throw new UnauthorizedException('Token inválido');
      const userId = Number(decoded.sub);
      const user = await this.usersService.findById(userId);
      if (!user || !user.refreshTokenHash)
        throw new UnauthorizedException('No autorizado');
      const ok = await bcrypt.compare(refreshToken, user.refreshTokenHash);
      if (!ok) throw new UnauthorizedException('No autorizado');
      return this.loginWithUser(user);
    } catch {
      throw new UnauthorizedException('No autorizado');
    }
  }
}
