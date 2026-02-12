import { Controller, Post, Req, Inject } from '@nestjs/common';
import type { Request } from 'express';

import { REGISTER_USE_CASE_TOKEN } from '@/infrastructure/frameworks/nestjs/modules/providers';
import { RegisterUseCase } from '@/application/use-cases/auth/register';
import { InputDto } from './input.dto';

@Controller('auth/register')
export class RegisterController {
  constructor(
    @Inject(REGISTER_USE_CASE_TOKEN)
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post()
  async register(@Req() req: Request) {
    const data = InputDto.parse(req);
    const validated = await InputDto.validate(data);

    if (validated) return validated;

    return await this.registerUseCase.execute(data);
  }
}
