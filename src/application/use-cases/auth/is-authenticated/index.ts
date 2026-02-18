import { SessionRepository } from '@/domain/ports/repositories/SessionRepository';
import { UserRepository } from '@/domain/ports/repositories/UserRepository';
import { TokenService } from '@/domain/ports/services/TokenService';
import { BusinessError } from '@/domain/errors/BusinessError';
import { InputDTO } from './input.dto';
import { OutputDTO } from './output.dto';

export class IsAuthenticatedUseCase {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: InputDTO): Promise<OutputDTO> {
    const { token } = input;

    try {
      // 1. Valida o JWT e extrai o sessionId
      const tokenPayload = await this.tokenService.validateAccessToken(token);

      // 2. Busca a sessão no banco
      const session = await this.sessionRepository.get(tokenPayload.sid);

      // 3. Verifica se a sessão existe e está ativa
      if (!session || !session.isActive()) {
        throw new BusinessError('Sessão inválida ou expirada', 401);
      }

      if (session.userId !== tokenPayload.sub) {
        throw new BusinessError('Sessão inválida ou expirada', 401);
      }

      // 4. Busca o usuário
      const user = await this.userRepository.get(session.userId);

      if (!user) {
        throw new BusinessError('Usuário não encontrado', 404);
      }

      if (user.tokenVersion !== tokenPayload.tv) {
        throw new BusinessError('Sessão inválida ou expirada', 401);
      }

      if (session.tokenVersion !== tokenPayload.tv) {
        throw new BusinessError('Sessão inválida ou expirada', 401);
      }

      if (session.deviceId !== tokenPayload.did) {
        throw new BusinessError('Sessão inválida ou expirada', 401);
      }

      return { user };
    } catch (error) {
      if (error instanceof BusinessError) {
        throw error;
      }
      throw new BusinessError('Token inválido', 401);
    }
  }
}
