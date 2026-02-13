import { Module } from '@nestjs/common';

import { TransactionController } from './controllers/transaction.controller';

@Module({
  controllers: [TransactionController],
})
export class TransactionsModule {}
