import { ulid } from 'ulid';
import { User } from '@/domain/entities/business/User';

export class Session {
  id: string;
  userId: string;
  user?: User;
  deviceId: string;
  refreshTokenHash: string;
  tokenVersion: number;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
  revokedAt?: Date;

  constructor(props: {
    id?: string;
    userId: string;
    user?: User;
    deviceId: string;
    refreshTokenHash: string;
    tokenVersion: number;
    ipAddress?: string;
    userAgent?: string;
    createdAt?: Date;
    expiresAt: Date;
    revokedAt?: Date;
  }) {
    this.id = props.id || ulid();
    this.userId = props.userId;
    this.user = props.user;
    this.deviceId = props.deviceId;
    this.refreshTokenHash = props.refreshTokenHash;
    this.tokenVersion = props.tokenVersion;
    this.ipAddress = props.ipAddress;
    this.userAgent = props.userAgent;
    this.createdAt = props.createdAt || new Date();
    this.expiresAt = props.expiresAt;
    this.revokedAt = props.revokedAt;
  }

  isActive(): boolean {
    const now = new Date();
    return !this.revokedAt && this.expiresAt > now;
  }

  revoke(): void {
    this.revokedAt = new Date();
  }
}
