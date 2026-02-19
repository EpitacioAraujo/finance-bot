import { Controller, Post, Req, Inject } from '@nestjs/common';
import type { Request } from 'express';
import * as zod from 'zod';

import { REGISTER_USE_CASE_TOKEN } from '@/infrastructure/frameworks/nestjs/modules/providers';
import { RegisterUseCase } from '@/application/use-cases/auth/register';
import { BusinessError } from '@/domain/errors/BusinessError';

@Controller('auth/register')
export class RegisterController {
  constructor(
    @Inject(REGISTER_USE_CASE_TOKEN)
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post()
  async register(@Req() req: Request) {
    const inputShape = zod.object({
      name: zod
        .string({ error: 'Nome é obrigatório' })
        .min(1, { message: 'Nome é obrigatório' }),
      email: zod
        .string({ error: 'Email é obrigatório' })
        .min(1, { message: 'Email é obrigatório' })
        .email({ message: 'Email deve ser um endereço de email válido' }),
      confirmEmail: zod
        .string({ error: 'Email é obrigatório' })
        .min(1, { message: 'Email é obrigatório' })
        .email({ message: 'Email deve ser um endereço de email válido' }),
      password: zod
        .string({ error: 'Senha é obrigatória' })
        .min(1, { message: 'Senha é obrigatória' }),
      confirmPassword: zod
        .string({ error: 'Confirmação de senha é obrigatória' })
        .min(1, { message: 'Confirmação de senha é obrigatória' }),
    });

    const input = inputShape.safeParse(req.body);

    if (!input.success) {
      throw new BusinessError('Invalid input', 400, input.error);
    }

    return await this.registerUseCase.execute(input.data);
  }
}
