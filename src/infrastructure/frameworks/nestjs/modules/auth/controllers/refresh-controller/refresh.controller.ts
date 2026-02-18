/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Post, Req, Inject, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

import { REFRESH_TOKEN_USE_CASE_TOKEN } from '@/infrastructure/frameworks/nestjs/modules/providers/use-cases/use-cases.module';
import { RefreshTokenUseCase } from '@/application/use-cases/auth/refresh-token';
import { InputDto } from './input.dto';
import { Env } from '@/domain/entities/common/env';

@Controller('auth/refresh')
export class RefreshController {
  constructor(
    @Inject(REFRESH_TOKEN_USE_CASE_TOKEN)
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post()
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = InputDto.parse(req);
    const validated = await InputDto.validate(data);

    if (validated) return validated;

    const result = await this.refreshTokenUseCase.execute(data);

    const env = Env.getInstance();
    const isProduction = env.isProduction();
    const sameSite = (env.COOKIE_SAMESITE || 'lax') as
      | 'lax'
      | 'strict'
      | 'none';

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return { ok: true };
  }
}
