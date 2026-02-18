/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { CreateNewSessionFacade } from '@/application/facades/create-new-session';
import { Module } from '@nestjs/common';
import { Provider } from '@nestjs/common';
import { SESSION_REPOSITORY_TOKEN } from '../repositories/repositories.module';
import {
  REFRESH_TOKEN_SERVICE_TOKEN,
  TOKEN_SERVICE_TOKEN,
} from '../services/services.module';

// Token constants for dependency injection
export const CREATE_NEW_SESSION_FACADE_TOKEN = 'CreateNewSessionFacade';

/**
* Use Case Providers Factory
 */
const facadeProviders: Provider[] = [
  {
    provide: CREATE_NEW_SESSION_FACADE_TOKEN,
    useFactory: (
      sessionRepository: any,
      tokenService: any,
      refreshTokenService: any,
    ) => {
        return new CreateNewSessionFacade(
          sessionRepository,
          tokenService,
          refreshTokenService,
        )
    },
    inject: [
      SESSION_REPOSITORY_TOKEN,
      TOKEN_SERVICE_TOKEN,
      REFRESH_TOKEN_SERVICE_TOKEN,
    ],
  },
];

@Module({
  providers: facadeProviders,
  exports: facadeProviders,
})
export class FacadesModule {}
