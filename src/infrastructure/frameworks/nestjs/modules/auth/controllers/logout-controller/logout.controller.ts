import { Controller, Req, Inject, UseGuards, Get } from '@nestjs/common';
import type { Request } from 'express';

import { LOGOUT_USE_CASE_TOKEN } from '@/infrastructure/frameworks/nestjs/modules/providers';
import { LogoutUseCase } from '@/application/use-cases/auth/logout';
import { JwtAuthGuard } from '@/infrastructure/frameworks/nestjs/guards/jwt-auth.guard';
import { InputDto } from './input.dto';

@Controller(`auth/logout`)
@UseGuards(JwtAuthGuard)
export class LogoutController {
  constructor(
    @Inject(LOGOUT_USE_CASE_TOKEN)
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Get()
  async logout(@Req() req: Request) {
    const data = InputDto.parse(req);
    const validated = await InputDto.validate(data);

    if (validated) return validated;

    return await this.logoutUseCase.execute(data);
  }
}
