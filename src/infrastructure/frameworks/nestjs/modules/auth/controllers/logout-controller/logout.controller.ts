import { Controller, Req, Inject, UseGuards, Get, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import * as zod from 'zod';

import { LOGOUT_USE_CASE_TOKEN } from '@/infrastructure/frameworks/nestjs/modules/providers';
import { LogoutUseCase } from '@/application/use-cases/auth/logout';
import { JwtAuthGuard } from '@/infrastructure/frameworks/nestjs/guards/jwt-auth.guard';
import { Env } from '@/domain/entities/common/env';
import { BusinessError } from '@/domain/errors/BusinessError';

@Controller(`auth/logout`)
@UseGuards(JwtAuthGuard)
export class LogoutController {
  constructor(
    @Inject(LOGOUT_USE_CASE_TOKEN)
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Get()
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const inputShape = zod.object({
      token: zod
        .string({ error: 'Token é obrigatório' })
        .min(1, { message: 'Token é obrigatório' }),
    });

    const input = inputShape.safeParse({
      token: req.cookies?.access_token || '',
    });

    if (!input.success) {
      throw new BusinessError('Invalid input', 400, input.error);
    }

    await this.logoutUseCase.execute(input.data);

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
