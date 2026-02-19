import { Repository } from 'typeorm';
import { PaymentCycle } from '@/domain/entities/business/PaymentCycle';
import {
  PaymentCycleRepository,
  PaymentCycleFilters,
} from '@/domain/ports/repositories/PaymentCycleRepository';
import { PaymentCycleSchema } from '@/infrastructure/config/typeorm/schemas';

export class TypeOrmPaymentCycleRepository implements PaymentCycleRepository {
  constructor(private repository: Repository<PaymentCycleSchema>) {}

  async store(payload: PaymentCycle): Promise<PaymentCycle> {
    const record = await this.repository.save({
      id: payload.id,
      start_date: payload.start_date,
      end_date: payload.end_date,
      paymentTypeId: payload.paymentTypeId,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    });
    return this.mapper(record);
  }

  async search(filters?: PaymentCycleFilters): Promise<PaymentCycle[]> {
    const query = this.repository.createQueryBuilder('PaymentCycle');

    if (filters?.paymentTypeId) {
      query.andWhere('PaymentCycle.paymentTypeId = :paymentTypeId', {
        paymentTypeId: filters.paymentTypeId,
      });
    }

    if (filters?.startDate) {
      query.andWhere('PaymentCycle.start_date >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters?.endDate) {
      query.andWhere('PaymentCycle.end_date <= :endDate', {
        endDate: filters.endDate,
      });
    }

    const records = await query.getMany();
    return records.map((schema) => this.mapper(schema));
  }

  async get(id: string): Promise<PaymentCycle | null> {
    const record = await this.repository.findOne({ where: { id } });
    if (!record) {
      return null;
    }
    return this.mapper(record);
  }

  async delete(PaymentCycle: PaymentCycle): Promise<void> {
    await this.repository.delete(PaymentCycle.id);
  }

  private mapper(schema: PaymentCycleSchema): PaymentCycle {
    return new PaymentCycle({
      id: schema.id,
      start_date: schema.start_date,
      end_date: schema.end_date,
      paymentTypeId: schema.paymentTypeId,
      created_at: schema.createdAt,
      updated_at: schema.updatedAt,
    });
  }
}
