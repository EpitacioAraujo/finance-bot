import { Repository } from 'typeorm';
import { User } from '@/domain/entities/business/User';
import {
  UserRepository,
  UserFilters,
} from '@/domain/ports/repositories/UserRepository';
import { UserSchema } from '@/infrastructure/config/typeorm/schemas';

export class TypeOrmUserRepository implements UserRepository {
  constructor(private repository: Repository<UserSchema>) {}

  async store(user: User): Promise<User> {
    const record = await this.repository.save(user);
    return this.mapper(record);
  }

  async search(filters: UserFilters): Promise<User[]> {
    const query = this.repository.createQueryBuilder('user');

    if (filters.email) {
      query.where('user.email = :email', { email: filters.email });
    }

    if (filters.isActive !== undefined) {
      query.andWhere('user.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    const records = await query.getMany();
    return records.map((schema) => this.mapper(schema));
  }

  async get(id: string): Promise<User | null> {
    const record = await this.repository.findOne({ where: { id } });
    if (!record) {
      return null;
    }
    return this.mapper(record);
  }

  async update(id: string, user: User): Promise<User> {
    const record = await this.repository.save({ ...user, id });
    return this.mapper(record);
  }

  async delete(user: User): Promise<void> {
    await this.repository.delete(user.id);
  }

  private mapper(schema: UserSchema): User {
    return new User({
      id: schema.id,
      name: schema.name || '',
      email: schema.email,
      passwordHash: schema.passwordHash,
      role: schema.role,
      isActive: schema.isActive,
      tokenVersion: schema.tokenVersion,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}
