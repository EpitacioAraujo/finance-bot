import { JwtService } from '@nestjs/jwt';
import { TokenService } from '@/domain/ports/services/TokenService';
import { JwtPayload } from '@/domain/entities/auth/JwtPayload';
import { BusinessError } from '@/domain/errors/BusinessError';

export class NestJwtTokenService implements TokenService {
  constructor(private jwtService: JwtService) {}

  async generateAccessToken(payload: JwtPayload): Promise<string> {
    // Converte a instância da classe para objeto plain
    const plainPayload = { sessionId: payload.sessionId };
    return this.jwtService.sign(plainPayload, { expiresIn: '15m' });
  }

  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    // Converte a instância da classe para objeto plain
    const plainPayload = { sessionId: payload.sessionId };
    return this.jwtService.sign(plainPayload, { expiresIn: '7d' });
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const decoded = this.jwtService.verify<{ sessionId: string }>(token);
      return new JwtPayload({ sessionId: decoded.sessionId });
    } catch {
      throw new BusinessError('Invalid token', 401);
    }
  }
}
