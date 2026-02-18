import { Controller, Req, Inject, UseGuards, Get, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

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
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const data = InputDto.parse(req);
    const validated = await InputDto.validate(data);

    if (validated) return validated;

    await this.logoutUseCase.execute(data);

    const isProduction = process.env.NODE_ENV === 'production';
    const sameSite = (process.env.COOKIE_SAMESITE || 'lax') as
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
