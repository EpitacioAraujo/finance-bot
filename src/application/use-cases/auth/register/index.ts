import { PasswordService } from '@/domain/ports/services/PasswordService';
import { InputDTO } from './input.dto';
import { User } from '@/domain/entities/business/User';
import { UserRepository } from '@/domain/ports/repositories/UserRepository';
import { BusinessError } from '@/domain/errors/BusinessError';

export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository, // TODO: UserRepository
    private readonly passwordService: PasswordService, // TODO: PasswordHasher
  ) {}

  async execute(input: InputDTO): Promise<any> {
    if (input.email !== input.confirmEmail) {
      throw new BusinessError('Email e confirmação de email devem ser iguais');
    }

    if (input.password !== input.confirmPassword) {
      throw new BusinessError('Senha e confirmação de senha devem ser iguais');
    }

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
    });

    await this.userRepository.store(user);

    return true;
  }
}
