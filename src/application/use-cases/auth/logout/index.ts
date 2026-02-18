import { SessionRepository } from '@/domain/ports/repositories/SessionRepository';
import { TokenService } from '@/domain/ports/services/TokenService';
import { BusinessError } from '@/domain/errors/BusinessError';
import { InputDTO } from './input.dto';

export class LogoutUseCase {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: InputDTO): Promise<void> {
    const { token } = input;

    try {
      // 1. Valida o JWT e extrai o sessionId
      const tokenPayload = await this.tokenService.validateAccessToken(token);

      // 2. Busca a sessão no banco
      const session = await this.sessionRepository.get(tokenPayload.sid);

      // 3. Verifica se a sessão existe
      if (!session) {
        throw new BusinessError('Sessão não encontrada', 404);
      }

      // 4. Revoga a sessão
      session.revoke();

      // 5. Salva a sessão revogada
      await this.sessionRepository.store(session);

      return;
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError('Token inválido', 401);
    }
  }
}
