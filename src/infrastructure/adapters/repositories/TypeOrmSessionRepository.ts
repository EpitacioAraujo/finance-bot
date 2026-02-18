import { Repository } from 'typeorm';
import { Session } from '@/domain/entities/auth/Session';
import { User } from '@/domain/entities/business/User';
import {
  SessionRepository,
  SessionFilters,
} from '@/domain/ports/repositories/SessionRepository';
import { SessionSchema } from '@/infrastructure/config/typeorm/schemas/Session.schema';

export class TypeOrmSessionRepository implements SessionRepository {
  constructor(private repository: Repository<SessionSchema>) {}

  async store(session: Session): Promise<Session> {
    const record = await this.repository.save({
      id: session.id,
      userId: session.userId,
      deviceId: session.deviceId,
      refreshTokenHash: session.refreshTokenHash,
      tokenVersion: session.tokenVersion,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
    });
    return this.mapper(record);
  }

  async search(filters: SessionFilters): Promise<Session[]> {
    const query = this.repository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.user', 'user');

    if (filters.id) {
      query.where('session.id = :id', { id: filters.id });
    }

    if (filters.userId) {
      query.andWhere('session.userId = :userId', { userId: filters.userId });
    }

    if (filters.deviceId) {
      query.andWhere('session.deviceId = :deviceId', {
        deviceId: filters.deviceId,
      });
    }

    if (filters.refreshTokenHash) {
      query.andWhere('session.refreshTokenHash = :refreshTokenHash', {
        refreshTokenHash: filters.refreshTokenHash,
      });
    }

    if (filters.isActive !== undefined && filters.isActive) {
      query.andWhere('session.revokedAt IS NULL');
      query.andWhere('session.expiresAt > :now', { now: new Date() });
    }

    const records = await query.getMany();
    return records.map((schema) => this.mapper(schema));
  }

  async get(id: string): Promise<Session | null> {
    const record = await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!record) {
      return null;
    }
    return this.mapper(record);
  }

  async delete(session: Session): Promise<void> {
    await this.repository.delete(session.id);
  }

  private mapper(schema: SessionSchema): Session {
    const user = schema.user
      ? new User({
          id: schema.user.id,
          name: schema.user.name || '',
          email: schema.user.email,
          passwordHash: schema.user.passwordHash,
          createdAt: schema.user.createdAt,
          updatedAt: schema.user.updatedAt,
        })
      : undefined;

    return new Session({
      id: schema.id,
      userId: schema.userId,
      user,
      deviceId: schema.deviceId,
      refreshTokenHash: schema.refreshTokenHash,
      tokenVersion: schema.tokenVersion,
      ipAddress: schema.ipAddress,
      userAgent: schema.userAgent,
      createdAt: schema.createdAt,
      expiresAt: schema.expiresAt,
      revokedAt: schema.revokedAt,
    });
  }
}
