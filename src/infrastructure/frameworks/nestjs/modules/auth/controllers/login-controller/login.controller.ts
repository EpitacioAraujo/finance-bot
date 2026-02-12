/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Post, Req, Inject } from '@nestjs/common';
import type { Request } from 'express';

import { LOGIN_USE_CASE_TOKEN } from '@/infrastructure/frameworks/nestjs/modules/providers';
import { LoginUseCase } from '@/application/use-cases/auth/login';
import { InputDto } from './input.dto';

@Controller('auth/login')
export class LoginController {
  constructor(
    @Inject(LOGIN_USE_CASE_TOKEN)
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post()
  async login(@Req() req: Request) {
    const data = InputDto.parse(req);
    const validated = await InputDto.validate(data);

    if (validated) return validated;

    return await this.loginUseCase.execute(data);
  }
}
