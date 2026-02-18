import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Provider } from '@nestjs/common';
import { Env } from '@/domain/entities/common/env';

// Adapters/Implementations
import { BcryptPasswordService } from '@/infrastructure/adapters/external-services/BcryptPasswordService';
import { NestJwtTokenService } from '@/infrastructure/adapters/external-services/NestJwtTokenService';
import { NodeCryptoRefreshTokenService } from '@/infrastructure/adapters/external-services/NodeCryptoRefreshTokenService';

// Token constants for dependency injection
export const PASSWORD_SERVICE_TOKEN = 'PasswordService';
export const TOKEN_SERVICE_TOKEN = 'TokenService';
export const REFRESH_TOKEN_SERVICE_TOKEN = 'RefreshTokenService';

/**
 * Service Providers Factory
 * Centraliza todas as factories de services (external-services)
 *
 * Este módulo fornece os providers para todos os serviços da aplicação,
 * como autenticação e criptografia.
 *
 * Sistemas de injeção:
 * - Usar os tokens (PASSWORD_SERVICE_TOKEN, TOKEN_SERVICE_TOKEN) nos decorators @Inject()
 */
const serviceProviders: Provider[] = [
  {
    provide: PASSWORD_SERVICE_TOKEN,
    useClass: BcryptPasswordService,
  },
  {
    provide: TOKEN_SERVICE_TOKEN,
    useFactory: (jwtService: JwtService) => {
      return new NestJwtTokenService(jwtService);
    },
    inject: [JwtService],
  },
  {
    provide: REFRESH_TOKEN_SERVICE_TOKEN,
    useClass: NodeCryptoRefreshTokenService,
  },
];

@Module({
  imports: [
    JwtModule.register({
      secret: Env.getInstance().JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: serviceProviders,
  exports: serviceProviders,
})
export class ServicesModule {}
