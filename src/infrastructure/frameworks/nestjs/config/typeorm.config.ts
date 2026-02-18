import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import path from 'path';
import { Env } from '@/domain/entities/common/env';

const resolvedEntitiesPath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'config',
  'typeorm',
  'schemas',
  '*.schema{.ts,.js}',
);

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: Env.getInstance().DB_HOST,
  port: parseInt(Env.getInstance().DB_PORT, 10) || 5432,
  username: Env.getInstance().DB_USER,
  password: Env.getInstance().DB_PASSWORD,
  database: Env.getInstance().DB_NAME,
  entities: [resolvedEntitiesPath],
  synchronize: !Env.getInstance().isProduction(),
  logging: Env.getInstance().DB_LOGGING === 'true',
} as TypeOrmModuleOptions;
