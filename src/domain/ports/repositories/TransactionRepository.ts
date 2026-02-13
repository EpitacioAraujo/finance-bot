import { Transaction } from '@/domain/entities/business/Transaction';
import { Delete } from './components/Delete';
import { Get } from './components/Get';
import { Search } from './components/Search';
import { Store } from './components/Store';

export interface TransactionFilters {
  id?: string;
  type?: 'income' | 'outcome';
  minAmount?: number;
  maxAmount?: number;
  executionDateFrom?: Date;
  executionDateTo?: Date;
  description?: string;
}

export type TransactionRepository = Store<Transaction> &
  Get<Transaction> &
  Search<Transaction, TransactionFilters> &
  Delete<Transaction>;