import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfig } from '@/infrastructure/frameworks/nestjs/config/typeorm.config';
import { ProvidersModule } from '@/infrastructure/frameworks/nestjs/modules/providers';
import { CreateAdminCommand } from './commands/create-admin.command';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ProvidersModule,
  ],
  providers: [CreateAdminCommand],
})
export class CliModule {}
