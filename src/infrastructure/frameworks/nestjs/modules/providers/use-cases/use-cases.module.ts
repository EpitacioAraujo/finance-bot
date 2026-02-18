/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Module } from '@nestjs/common';
import { Provider } from '@nestjs/common';

// Use Cases
import { RegisterUseCase } from '@/application/use-cases/auth/register/index';
import { LoginUseCase } from '@/application/use-cases/auth/login/index';
import { IsAuthenticatedUseCase } from '@/application/use-cases/auth/is-authenticated/index';
import { LogoutUseCase } from '@/application/use-cases/auth/logout/index';
import { RefreshTokenUseCase } from '@/application/use-cases/auth/refresh-token/index';

// Import repositories and services modules to use their exports
import {
  USER_REPOSITORY_TOKEN,
  SESSION_REPOSITORY_TOKEN,
} from '../repositories/repositories.module';

import {
  PASSWORD_SERVICE_TOKEN,
  REFRESH_TOKEN_SERVICE_TOKEN,
  TOKEN_SERVICE_TOKEN,
} from '../services/services.module';
import { CREATE_NEW_SESSION_FACADE_TOKEN, FacadesModule } from '../facades/facades.module';

// Token constants for dependency injection
export const REGISTER_USE_CASE_TOKEN = 'RegisterUseCase';
export const LOGIN_USE_CASE_TOKEN = 'LoginUseCase';
export const IS_AUTHENTICATED_USE_CASE_TOKEN = 'IsAuthenticatedUseCase';
export const LOGOUT_USE_CASE_TOKEN = 'LogoutUseCase';
export const REFRESH_TOKEN_USE_CASE_TOKEN = 'RefreshTokenUseCase';

/**
 * Use Case Providers Factory
 * Centraliza todas as factories de use cases
 *
 * Este módulo fornece os providers para todos os use cases da aplicação.
 * Cada use case é uma factory que injeta suas dependências (repositories, services).
 *
 * Sistemas de injeção:
 * - Usar os tokens (REGISTER_USE_CASE_TOKEN, etc.) nos decorators @Inject()
 */
const useCaseProviders: Provider[] = [
  {
    provide: REGISTER_USE_CASE_TOKEN,
    useFactory: (userRepository: any, passwordService: any) =>
      new RegisterUseCase(userRepository, passwordService),
    inject: [USER_REPOSITORY_TOKEN, PASSWORD_SERVICE_TOKEN],
  },
  {
    provide: LOGIN_USE_CASE_TOKEN,
    useFactory: (
      userRepository: any,
      passwordService: any,
      createNewSessionFacade: any,
    ) => new LoginUseCase(userRepository, passwordService, createNewSessionFacade),
    inject: [
      USER_REPOSITORY_TOKEN,
      PASSWORD_SERVICE_TOKEN,
      CREATE_NEW_SESSION_FACADE_TOKEN,
    ],
  },
  {
    provide: IS_AUTHENTICATED_USE_CASE_TOKEN,
    useFactory: (
      sessionRepository: any,
      userRepository: any,
      tokenService: any,
    ) =>
      new IsAuthenticatedUseCase(
        sessionRepository,
        userRepository,
        tokenService,
      ),
    inject: [
      SESSION_REPOSITORY_TOKEN,
      USER_REPOSITORY_TOKEN,
      TOKEN_SERVICE_TOKEN,
    ],
  },
  {
    provide: LOGOUT_USE_CASE_TOKEN,
    useFactory: (sessionRepository: any, tokenService: any) =>
      new LogoutUseCase(sessionRepository, tokenService),
    inject: [SESSION_REPOSITORY_TOKEN, TOKEN_SERVICE_TOKEN],
  },
  {
    provide: REFRESH_TOKEN_USE_CASE_TOKEN,
    useFactory: (
      sessionRepository: any,
      userRepository: any,
      tokenService: any,
      refreshTokenService: any,
    ) =>
      new RefreshTokenUseCase(
        sessionRepository,
        userRepository,
        tokenService,
        refreshTokenService,
      ),
    inject: [
      SESSION_REPOSITORY_TOKEN,
      USER_REPOSITORY_TOKEN,
      TOKEN_SERVICE_TOKEN,
      REFRESH_TOKEN_SERVICE_TOKEN,
    ],
  },
];

@Module({
  imports: [FacadesModule],
  providers: useCaseProviders,
  exports: useCaseProviders,
})
export class UseCasesModule {}
