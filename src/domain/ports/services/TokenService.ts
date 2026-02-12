import { JwtPayload } from '@/domain/entities/auth/JwtPayload';

export interface TokenService {
  generateAccessToken(payload: JwtPayload): Promise<string>;
  generateRefreshToken(payload: JwtPayload): Promise<string>;
  validateToken(token: string): Promise<JwtPayload>;
}
