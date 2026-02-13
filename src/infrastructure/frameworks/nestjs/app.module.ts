import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { typeOrmConfig } from '@/infrastructure/frameworks/nestjs/config/typeorm.config';
import { ResponseInterceptor } from '@/infrastructure/frameworks/nestjs/interceptors/response.interceptor';

import { AuthModule } from '@/infrastructure/frameworks/nestjs/modules/auth/auth.module';
import { TransactionsModule } from '@/infrastructure/frameworks/nestjs/modules/transactions/transactions.module';
import { ProvidersModule } from '@/infrastructure/frameworks/nestjs/modules/providers';
import { GlobalExceptionFilter } from './filters/global-exception-filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ProvidersModule,
    AuthModule,
    TransactionsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
