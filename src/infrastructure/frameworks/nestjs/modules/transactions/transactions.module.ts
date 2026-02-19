import { Module } from '@nestjs/common';
import { CreateTransactionController } from './controllers/create/create-transaction.controller';


@Module({
  controllers: [CreateTransactionController],
})
export class TransactionsModule {}
