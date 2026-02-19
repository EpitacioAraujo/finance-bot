import { PaymentCycle } from '@/domain/entities/business/PaymentCycle';
import { Delete } from './components/Delete';
import { Get } from './components/Get';
import { Search } from './components/Search';
import { Store } from './components/Store';

export interface PaymentCycleFilters {
    paymentTypeId?: string;
    startDate?: Date;
    endDate?: Date;
}

export type PaymentCycleRepository = Store<PaymentCycle> &
  Get<PaymentCycle> &
  Search<PaymentCycle, PaymentCycleFilters> &
  Delete<PaymentCycle>;