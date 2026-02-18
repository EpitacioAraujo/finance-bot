import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { IsAuthenticatedUseCase } from '@/application/use-cases/auth/is-authenticated/index';
import { IS_AUTHENTICATED_USE_CASE_TOKEN } from '@/infrastructure/frameworks/nestjs/modules/providers/use-cases/use-cases.module';

/**
 * Guard de autenticação JWT
 *
 * Este guard valida se o usuário está autenticado usando o IsAuthenticatedUseCase.
 * Extrai o token do header Authorization e valida se a sessão está ativa.
 *
 * Para usar este guard:
 * @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(IS_AUTHENTICATED_USE_CASE_TOKEN)
    private readonly isAuthenticatedUseCase: IsAuthenticatedUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      const result = await this.isAuthenticatedUseCase.execute({ token });

      // Adiciona o usuário ao request para uso nas rotas
      request.user = result.user;

      return true;
    } catch {
      throw new UnauthorizedException('Sessão inválida ou expirada');
    }
  }

  private extractTokenFromCookie(request: any): string | undefined {
    return request.cookies?.access_token;
  }
}
