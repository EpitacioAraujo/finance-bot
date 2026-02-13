import { Controller, Inject } from '@nestjs/common';
import type { Request } from 'express';

import { AbstractNestCrudController } from '@/infrastructure/crud-controller/nestjs/AbstractNestCrudController';
import { Transaction } from '@/domain/entities/business/Transaction';
import { TransactionFilters } from '@/domain/ports/repositories/TransactionRepository';
import type { TransactionRepository } from '@/domain/ports/repositories/TransactionRepository';
import { TRANSACTION_REPOSITORY_TOKEN } from '@/infrastructure/frameworks/nestjs/modules/providers';

import { CreateTransactionDto } from './dtos/create-input.dto';
import { DeleteTransactionDto } from './dtos/delete-input.dto';
import { GetTransactionDto } from './dtos/get-input.dto';
import { SearchTransactionsDto } from './dtos/search-input.dto';
import { UpdateTransactionDto } from './dtos/update-input.dto';


@Controller('transactions')
export class TransactionController extends AbstractNestCrudController<
  Transaction,
  TransactionFilters,
  TransactionRepository
> {
  constructor(
    @Inject(TRANSACTION_REPOSITORY_TOKEN)
    repository: TransactionRepository,
  ) {
    super(repository, {
      parsers: {
        create: (req: Request) => CreateTransactionDto.parse(req),
        update: (req: Request) => UpdateTransactionDto.parse(req),
        delete: (data: any) => DeleteTransactionDto.parse(data),
        get: (data: any) => GetTransactionDto.parse(data),
        search: (req: Request) => SearchTransactionsDto.parse(req),
      },
      validators: {
        create: async (data: CreateTransactionDto) =>
          CreateTransactionDto.validate(data),
        update: async (data: UpdateTransactionDto) =>
          UpdateTransactionDto.validate(data),
        delete: async () => null,
        get: async () => null,
        search: async () => null,
      },
      entityFabricator: (data: any) =>
        new Transaction({
          id: data.id,
          amount: Number(data.amount),
          type: data.type,
          description: data.description,
          executionDate: data.executionDate
            ? new Date(data.executionDate)
            : undefined,
          createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
          updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
        }),
    });
  }
}
