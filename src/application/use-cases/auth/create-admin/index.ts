import { PasswordService } from '@/domain/ports/services/PasswordService';
import { InputDTO } from './input.dto';
import { User } from '@/domain/entities/business/User';
import { UserRepository } from '@/domain/ports/repositories/UserRepository';
import { BusinessError } from '@/domain/errors/BusinessError';

export class CreateAdminUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(input: InputDTO): Promise<User> {
    const existingUser = await this.userRepository.search({
      email: input.email,
    });

    if (existingUser && existingUser.length > 0) {
      throw new BusinessError('Email já está em uso');
    }

    const passwordHash = await this.passwordService.hash(input.password);

    const user = new User({
      name: input.name,
      email: input.email,
      passwordHash: passwordHash,
      role: 'admin',
      isActive: true,
    });

    return this.userRepository.store(user);
  }
}
