import { Repository } from 'typeorm';
import { Transaction } from '@/domain/entities/business/Transaction';
import {
  TransactionRepository,
  TransactionFilters,
} from '@/domain/ports/repositories/TransactionRepository';
import { TransactionSchema } from '@/infrastructure/config/typeorm/schemas';

export class TypeOrmTransactionRepository implements TransactionRepository {
  constructor(private repository: Repository<TransactionSchema>) {}

  async store(transaction: Transaction): Promise<Transaction> {
    const record = await this.repository.save({
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      executionDate: transaction.executionDate,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
    return this.mapper(record);
  }

  async search(filters: TransactionFilters): Promise<Transaction[]> {
    const query = this.repository.createQueryBuilder('transaction');

    if (filters.id) {
      query.where('transaction.id = :id', { id: filters.id });
    }

    if (filters.type) {
      query.andWhere('transaction.type = :type', { type: filters.type });
    }

    if (filters.minAmount !== undefined) {
      query.andWhere('transaction.amount >= :minAmount', {
        minAmount: filters.minAmount,
      });
    }

    if (filters.maxAmount !== undefined) {
      query.andWhere('transaction.amount <= :maxAmount', {
        maxAmount: filters.maxAmount,
      });
    }

    if (filters.executionDateFrom) {
      query.andWhere('transaction.executionDate >= :executionDateFrom', {
        executionDateFrom: filters.executionDateFrom,
      });
    }

    if (filters.executionDateTo) {
      query.andWhere('transaction.executionDate <= :executionDateTo', {
        executionDateTo: filters.executionDateTo,
      });
    }

    if (filters.description) {
      query.andWhere('transaction.description ILIKE :description', {
        description: `%${filters.description}%`,
      });
    }

    const records = await query.getMany();
    return records.map((schema) => this.mapper(schema));
  }

  async get(id: string): Promise<Transaction | null> {
    const record = await this.repository.findOne({ where: { id } });
    if (!record) {
      return null;
    }
    return this.mapper(record);
  }

  async delete(transaction: Transaction): Promise<void> {
    await this.repository.delete(transaction.id);
  }

  private mapper(schema: TransactionSchema): Transaction {
    return new Transaction({
      id: schema.id,
      amount: Number(schema.amount),
      description: schema.description,
      type: schema.type,
      executionDate: schema.executionDate,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}
