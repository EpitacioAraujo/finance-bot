import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { Env } from '@/domain/entities/common/env';

export async function bootstrap() {
  const env = Env.getInstance();
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  const port = env.PORT || 3301;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
