import { IsNotEmpty, IsString } from 'class-validator';
import { BaseClassValidatorDto } from '@/infrastructure/crud-controller/nestjs/BaseClassValidatorDto';
import { Request } from 'express';
import { InputDTO as LogoutInputDTO } from '@/application/use-cases/auth/logout/input.dto';

export class InputDto extends BaseClassValidatorDto implements LogoutInputDTO {
  @IsString({
    message: 'Token deve ser um texto',
  })
  @IsNotEmpty({
    message: 'Token é obrigatório',
  })
  token: string;

  static parse(req: Request): InputDto {
    const dto = new InputDto();

    // Extrai o token do header Authorization
    const authorization = req.headers.authorization;
    if (authorization) {
      const [type, token] = authorization.split(' ');
      dto.token = type === 'Bearer' ? token : '';
    } else {
      dto.token = '';
    }

    return dto;
  }

  static async validate(dto: InputDto): Promise<string[] | null> {
    const validation = await super.validate(dto);

    return validation;
  }
}
