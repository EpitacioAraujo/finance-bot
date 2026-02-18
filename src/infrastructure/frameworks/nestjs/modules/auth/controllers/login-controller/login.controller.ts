/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Post, Req, Inject, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

import { LOGIN_USE_CASE_TOKEN } from '@/infrastructure/frameworks/nestjs/modules/providers';
import { LoginUseCase } from '@/application/use-cases/auth/login';
import { InputDto } from './input.dto';
import { Env } from '@/domain/entities/common/env';
import { TokenPolicy } from '@/domain/entities/auth/TokenPolicy';

@Controller('auth/login')
export class LoginController {
  constructor(
    @Inject(LOGIN_USE_CASE_TOKEN)
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post()
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const data = InputDto.parse(req);
    const validated = await InputDto.validate(data);

    if (validated) return validated;

    const result = await this.loginUseCase.execute({
      ...data,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

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
