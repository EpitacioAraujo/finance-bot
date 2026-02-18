import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { RefreshTokenService } from '@/domain/ports/services/RefreshTokenService';

export class NodeCryptoRefreshTokenService implements RefreshTokenService {
  generate(): string {
    return randomBytes(64).toString('hex');
  }

  hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  compare(token: string, hash: string): boolean {
    const tokenHash = this.hash(token);
    const tokenBuffer = Buffer.from(tokenHash, 'hex');
    const hashBuffer = Buffer.from(hash, 'hex');

    if (tokenBuffer.length !== hashBuffer.length) {
      return false;
    }

    return timingSafeEqual(tokenBuffer, hashBuffer);
  }
}
