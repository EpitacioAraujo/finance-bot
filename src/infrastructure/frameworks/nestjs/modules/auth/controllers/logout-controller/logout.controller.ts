import { Controller, Req, Inject, UseGuards, Get, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

import { LOGOUT_USE_CASE_TOKEN } from '@/infrastructure/frameworks/nestjs/modules/providers';
import { LogoutUseCase } from '@/application/use-cases/auth/logout';
import { JwtAuthGuard } from '@/infrastructure/frameworks/nestjs/guards/jwt-auth.guard';
import { InputDto } from './input.dto';
import { Env } from '@/domain/entities/common/env';

@Controller(`auth/logout`)
@UseGuards(JwtAuthGuard)
export class LogoutController {
  constructor(
    @Inject(LOGOUT_USE_CASE_TOKEN)
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Get()
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const data = InputDto.parse(req);
    const validated = await InputDto.validate(data);

    if (validated) return validated;

    await this.logoutUseCase.execute(data);

    const env = Env.getInstance();
    const isProduction = env.isProduction();
    const sameSite = (env.COOKIE_SAMESITE || 'lax') as
      | 'lax'
      | 'strict'
      | 'none';

    res.clearCookie('access_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite,
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite,
    });

    return { ok: true };
  }
}
