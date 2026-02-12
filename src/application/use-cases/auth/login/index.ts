import { UserRepository } from '@/domain/ports/repositories/UserRepository';
import { PasswordService } from '@/domain/ports/services/PasswordService';
import { InputDTO } from './input.dto';
import { OutputDTO } from './output.dto';
import { BusinessError } from '@/domain/errors/BusinessError';
import { CreateNewSessionFacade } from '@/application/facades/create-new-session';

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly createNewSessionFacade: CreateNewSessionFacade,
  ) {}

  async execute(input: InputDTO): Promise<OutputDTO> {
    const { email, password } = input;

    // Find the user by email
    const users = await this.userRepository.search({ email });
    if (users.length === 0) {
      throw new BusinessError('Invalid credentials', 401);
    }
    const user = users[0];

    // Check if the password is correct
    const isPasswordValid = await this.passwordService.compare(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new BusinessError('Invalid credentials', 401);
    }

    const session = await this.createNewSessionFacade.execute({ user });

    return session;
  }
}
