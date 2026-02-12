import { UserRepository } from '@/domain/ports/repositories/UserRepository';
import { PasswordService } from '@/domain/ports/services/PasswordService';
import { TokenService } from '@/domain/ports/services/TokenService';
import { SessionRepository } from '@/domain/ports/repositories/SessionRepository';
import { InputDTO } from './input.dto';
import { OutputDTO } from './output.dto';
import { BusinessError } from '@/domain/errors/BusinessError';
import { Session } from '@/domain/entities/auth/Session';
import { JwtPayload } from '@/domain/entities/auth/JwtPayload';

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(input: InputDTO): Promise<OutputDTO> {
    const { email, password } = input;

    // Find the user by email
    const users = await this.userRepository.search({ email });
    if (users.length === 0) {
      throw new BusinessError('Invalid credentials', 401);
    }
    const user = users[0];

    // Check if the password is correct
    const isPasswordValid = await this.passwordService.compare(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new BusinessError('Invalid credentials', 401);
    }

    // 1. Cria a sessão no banco ANTES de gerar o JWT
    const session = new Session({
      userId: user.id,
      user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      // Opcional: capturar IP e UserAgent do request
      // ipAddress: request.ip,
      // userAgent: request.headers['user-agent'],
    });

    await this.sessionRepository.store(session);

    // 2. Gera os tokens JWT com o sessionId
    const payload = new JwtPayload({ sessionId: session.id });
    const accessToken = await this.tokenService.generateAccessToken(payload);
    const refreshToken = await this.tokenService.generateRefreshToken(payload);

    // Return the tokens
    return {
      accessToken,
      refreshToken,
    };
  }
}
