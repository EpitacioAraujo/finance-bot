import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '@/infrastructure/frameworks/nestjs/guards/jwt-auth.guard';
import { RegisterController } from './controllers/register-controller/register.controller';
import { LoginController } from './controllers/login-controller/login.controller';
import { LogoutController } from './controllers/logout-controller/logout.controller';
import { UseCasesModule } from '../providers/use-cases/use-cases.module';

/**
 * Módulo de autenticação
 *
 * Fornece controllers e guards para autenticação.
 */
@Module({
  imports: [UseCasesModule],
  controllers: [RegisterController, LoginController, LogoutController],
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
