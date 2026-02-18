export class TokenPolicy {
  static accessTokenTtlMs = 15 * 60 * 1000;
  static refreshTokenTtlMs = 30 * 24 * 60 * 60 * 1000;

  static accessTokenMaxAgeMs(): number {
    return this.accessTokenTtlMs;
  }

  static refreshTokenMaxAgeMs(): number {
    return this.refreshTokenTtlMs;
  }

  static refreshTokenExpiresAt(nowMs: number = Date.now()): Date {
    return new Date(nowMs + this.refreshTokenTtlMs);
  }
}
