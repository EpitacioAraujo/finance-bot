/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Post, Req, Inject, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import * as zod from 'zod';

import { REFRESH_TOKEN_USE_CASE_TOKEN } from '@/infrastructure/frameworks/nestjs/modules/providers/use-cases/use-cases.module';
import { RefreshTokenUseCase } from '@/application/use-cases/auth/refresh-token';
import { Env } from '@/domain/entities/common/env';
import { TokenPolicy } from '@/domain/entities/auth/TokenPolicy';
import { BusinessError } from '@/domain/errors/BusinessError';

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
    const inputShape = zod.object({
      refreshToken: zod
        .string({ error: 'Refresh token é obrigatório' })
        .min(1, { message: 'Refresh token é obrigatório' }),
      ipAddress: zod.string().optional(),
      userAgent: zod.string().optional(),
    });

    const input = inputShape.safeParse({
      refreshToken: req.cookies?.refresh_token || '',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    if (!input.success) {
      throw new BusinessError('Invalid input', 400, input.error);
    }

    const result = await this.refreshTokenUseCase.execute(input.data);

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
      maxAge: TokenPolicy.accessTokenMaxAgeMs(),
    });
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite,
      maxAge: TokenPolicy.refreshTokenMaxAgeMs(),
    });

    return { ok: true };
  }
}
