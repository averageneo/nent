import { CacheModuleOptions } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';
import * as redisStore from 'cache-manager-redis-store';

config();
class ConfigService {
  private readonly baseDir: string;

  constructor(private readonly env: { [k: string]: string | undefined }) {
    let current = __dirname;
    while (!existsSync(join(current, 'node_modules'))) {
      current = join(current, '../');
    }
    this.baseDir = current;
  }

  public getValue(key: string, throwOnMissing = true): string {
    const value = process.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value || '';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('DATABASE_URL'),
      port: Number(this.getValue('DATABASE_PORT')),
      username: this.getValue('DATABASE_USERNAME'),
      password: this.getValue('DATABASE_PASSWORD'),
      database: this.getValue('DATABASE_DATABASE'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      retryAttempts: 10,
      retryDelay: 3000,
      synchronize: true,
    };
  }

  public getRedisConfig(): CacheModuleOptions {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      store: redisStore as any,
      host: this.getValue('REDIS_HOST'),
      port: 6379,
      ttl: 86400,
    };
  }
}

const configService = new ConfigService(process.env);

type ConfigServiceType = typeof configService;

export { configService, ConfigServiceType };
