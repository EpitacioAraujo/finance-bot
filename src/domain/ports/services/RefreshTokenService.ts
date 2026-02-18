export interface RefreshTokenService {
  generate(): string;
  hash(token: string): string;
  compare(token: string, hash: string): boolean;
}
