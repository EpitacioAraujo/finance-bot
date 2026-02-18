import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '@/infrastructure/frameworks/nestjs/guards/jwt-auth.guard';

@Controller('auth/me')
@UseGuards(JwtAuthGuard)
export class MeController {
  @Get()
  async me(@Req() req: Request) {
    const user = req.user as any;

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
