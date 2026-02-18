import { Command, CommandRunner, Option } from 'nest-commander';
import { Inject } from '@nestjs/common';

import { CreateAdminUseCase } from '@/application/use-cases/auth/create-admin';
import { CREATE_ADMIN_USE_CASE_TOKEN } from '@/infrastructure/frameworks/nestjs/modules/providers';

interface CreateAdminCommandOptions {
  name?: string;
  email?: string;
  password?: string;
}

@Command({
  name: 'create-admin',
  description: 'Cria um usuário administrador',
})
export class CreateAdminCommand extends CommandRunner {
  constructor(
    @Inject(CREATE_ADMIN_USE_CASE_TOKEN)
    private readonly createAdminUseCase: CreateAdminUseCase,
  ) {
    super();
  }

  async run(
    _inputs: string[],
    options?: CreateAdminCommandOptions,
  ): Promise<void> {
    const name = options?.name?.trim();
    const email = options?.email?.trim();
    const password = options?.password;

    if (!name || !email || !password) {
      throw new Error(
        'Parâmetros obrigatórios: --name <nome> --email <email> --password <senha>',
      );
    }

    const user = await this.createAdminUseCase.execute({
      name,
      email,
      password,
    });

    console.log(`Admin criado: ${user.id} (${user.email})`);
  }

  @Option({
    flags: '-n, --name <name>',
    description: 'Nome do admin',
  })
  parseName(value: string): string {
    return value;
  }

  @Option({
    flags: '-e, --email <email>',
    description: 'Email do admin',
  })
  parseEmail(value: string): string {
    return value;
  }

  @Option({
    flags: '-p, --password <password>',
    description: 'Senha do admin',
  })
  parsePassword(value: string): string {
    return value;
  }
}
