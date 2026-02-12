import { User } from '@/domain/entities/business/User';
import { Store } from './components/Store';
import { Get } from './components/Get';
import { Search } from './components/Search';
import { Delete } from './components/Delete';

export interface UserFilters {
  [key: string]: any;
  // productId?: string
  // availableQuantityGreaterThan?: number
  // availableQuantityLessThan?: number
}

export type UserRepository = Store<User> &
  Get<User> &
  Search<User, UserFilters> &
  Delete<User>;
