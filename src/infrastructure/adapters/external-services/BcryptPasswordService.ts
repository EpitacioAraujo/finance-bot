import * as bcrypt from 'bcrypt';
import { PasswordService } from '@/domain/ports/services/PasswordService';

export class BcryptPasswordService implements PasswordService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
