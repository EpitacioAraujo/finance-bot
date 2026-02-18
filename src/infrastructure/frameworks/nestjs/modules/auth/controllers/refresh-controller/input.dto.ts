import { IsNotEmpty, IsString } from 'class-validator';
import { BaseClassValidatorDto } from '@/infrastructure/crud-controller/nestjs/BaseClassValidatorDto';
import { Request } from 'express';
import { InputDTO as RefreshInputDTO } from '@/application/use-cases/auth/refresh-token/input.dto';

export class InputDto extends BaseClassValidatorDto implements RefreshInputDTO {
  @IsString({
    message: 'Refresh token deve ser um texto',
  })
  @IsNotEmpty({
    message: 'Refresh token é obrigatório',
  })
  refreshToken: string;

  ipAddress?: string;
  userAgent?: string;

  static parse(req: Request): InputDto {
    const dto = new InputDto();

    dto.refreshToken = req.cookies?.refresh_token || '';
    dto.ipAddress = req.ip;
    dto.userAgent = req.headers['user-agent'];

    return dto;
  }

  static async validate(dto: InputDto): Promise<string[] | null> {
    const validation = await super.validate(dto);

    return validation;
  }
}
