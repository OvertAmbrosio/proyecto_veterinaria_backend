import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../config/environment.js';
import { User } from '../users/user.entity.js';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables, true>) => {
        const url = config.get('DATABASE_URL', { infer: true });
        const env = config.get('NODE_ENV', { infer: true });
        const isLocal = env === 'local';

        if (!url) throw new Error('DATABASE_URL is not set');

        const options: PostgresConnectionOptions = {
          type: 'postgres',
          url,
          entities: [User],
          synchronize: true, // TODO: disable in prod and use migrations
          ssl: !isLocal,
          extra: !isLocal ? { ssl: { rejectUnauthorized: false } } : undefined,
        };
        return options;
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
