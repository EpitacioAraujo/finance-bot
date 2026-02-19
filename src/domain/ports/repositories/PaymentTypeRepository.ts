import { PaymentType } from '@/domain/entities/business/PaymentType';
import { Delete } from './components/Delete';
import { Get } from './components/Get';
import { Search } from './components/Search';
import { Store } from './components/Store';

export interface PaymentTypeFilters {
  id?: string;
}

export type PaymentTypeRepository = Store<PaymentType> &
  Get<PaymentType> &
  Search<PaymentType, PaymentTypeFilters> &
  Delete<PaymentType>;