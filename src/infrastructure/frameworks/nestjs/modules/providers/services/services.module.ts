import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Provider } from '@nestjs/common';

// Adapters/Implementations
import { BcryptPasswordService } from '@/infrastructure/adapters/external-services/BcryptPasswordService';
import { NestJwtTokenService } from '@/infrastructure/adapters/external-services/NestJwtTokenService';

// Token constants for dependency injection
export const PASSWORD_SERVICE_TOKEN = 'PasswordService';
export const TOKEN_SERVICE_TOKEN = 'TokenService';

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
];

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: serviceProviders,
  exports: serviceProviders,
})
export class ServicesModule {}
