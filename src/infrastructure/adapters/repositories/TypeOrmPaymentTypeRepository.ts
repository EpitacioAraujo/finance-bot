import { Repository } from 'typeorm';
import { PaymentType } from '@/domain/entities/business/PaymentType';
import {
  PaymentTypeRepository,
  PaymentTypeFilters,
} from '@/domain/ports/repositories/PaymentTypeRepository';
import { PaymentTypeSchema } from '@/infrastructure/config/typeorm/schemas';

export class TypeOrmPaymentTypeRepository implements PaymentTypeRepository {
  constructor(private repository: Repository<PaymentTypeSchema>) {}

  async store(payload: PaymentType): Promise<PaymentType> {
    const record = await this.repository.save({
      id: payload.id,
      name: payload.name,
      cycle_type: payload.cycle_type,
      cycle_day_start: payload.cycle_day_start,
      cycle_day_end: payload.cycle_day_end,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    });
    return this.mapper(record);
  }

  async search(filters?: PaymentTypeFilters): Promise<PaymentType[]> {
    const query = this.repository.createQueryBuilder('PaymentType');

    if (filters?.id) {
      query.where('PaymentType.id = :id', { id: filters.id });
    }

    const records = await query.getMany();
    return records.map((schema) => this.mapper(schema));
  }

  async get(id: string): Promise<PaymentType | null> {
    const record = await this.repository.findOne({ where: { id } });
    if (!record) {
      return null;
    }
    return this.mapper(record);
  }

  async delete(PaymentType: PaymentType): Promise<void> {
    await this.repository.delete(PaymentType.id);
  }

  private mapper(schema: PaymentTypeSchema): PaymentType {
    return new PaymentType({
      id: schema.id,
      name: schema.name,
      cycle_type: schema.cycle_type,
      cycle_day_start: schema.cycle_day_start,
      cycle_day_end: schema.cycle_day_end,
      created_at: schema.createdAt,
      updated_at: schema.updatedAt,
    });
  }
}
