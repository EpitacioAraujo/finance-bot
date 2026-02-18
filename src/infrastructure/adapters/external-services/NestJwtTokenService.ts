import { JwtService } from '@nestjs/jwt';
import { TokenService } from '@/domain/ports/services/TokenService';
import { JwtPayload } from '@/domain/entities/auth/JwtPayload';
import { BusinessError } from '@/domain/errors/BusinessError';

export class NestJwtTokenService implements TokenService {
  constructor(private jwtService: JwtService) {}

  async generateAccessToken(payload: JwtPayload): Promise<string> {
    const plainPayload = {
      sub: payload.sub,
      sid: payload.sid,
      did: payload.did,
      tv: payload.tv,
      jti: payload.jti,
    };
    return this.jwtService.sign(plainPayload, { expiresIn: '15m' });
  }

  async validateAccessToken(token: string): Promise<JwtPayload> {
    try {
      const decoded = this.jwtService.verify<{
        sub: string;
        sid: string;
        did: string;
        tv: number;
        jti: string;
      }>(token);
      return new JwtPayload({
        sub: decoded.sub,
        sid: decoded.sid,
        did: decoded.did,
        tv: decoded.tv,
        jti: decoded.jti,
      });
    } catch {
      throw new BusinessError('Invalid token', 401);
    }
  }
}
