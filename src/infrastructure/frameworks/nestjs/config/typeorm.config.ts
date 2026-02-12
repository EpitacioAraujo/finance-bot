import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import path from 'path';

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
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'dibie_user',
  password: process.env.DB_PASSWORD || 'dibie_password',
  database: process.env.DB_NAME || 'dibie_db',
  entities: [resolvedEntitiesPath],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.DB_LOGGING === 'true',
} as TypeOrmModuleOptions;
