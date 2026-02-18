import { JwtPayload } from '@/domain/entities/auth/JwtPayload';

export interface TokenService {
  generateAccessToken(payload: JwtPayload): Promise<string>;
  validateAccessToken(token: string): Promise<JwtPayload>;
}
