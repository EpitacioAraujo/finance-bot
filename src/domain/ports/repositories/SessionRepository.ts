import { Store } from './components/Store';
import { Get } from './components/Get';
import { Search } from './components/Search';
import { Delete } from './components/Delete';
import { Session } from '@/domain/entities/auth/Session';

export interface SessionFilters {
  id?: string;
  userId?: string;
  deviceId?: string;
  refreshTokenHash?: string;
  isActive?: boolean;
}

export type SessionRepository = Store<Session> &
  Get<Session> &
  Search<Session, SessionFilters> &
  Delete<Session>;
