import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { BaseClassValidatorDto } from '@/infrastructure/crud-controller/nestjs/BaseClassValidatorDto';
import { Request } from 'express';
import { InputDTO as LoginInputDTO } from '@/application/use-cases/auth/login/input.dto';

export class InputDto extends BaseClassValidatorDto implements LoginInputDTO {
  @IsEmail(
    {},
    {
      message: 'Email deve ser um endereço de email válido',
    },
  )
  @IsNotEmpty({
    message: 'Email é obrigatório',
  })
  email: string;

  @IsString({
    message: 'Senha deve ser um texto',
  })
  @IsNotEmpty({
    message: 'Senha é obrigatória',
  })
  password: string;

  static parse(req: Request): InputDto {
    const dto = new InputDto();

    dto.email = req.body.email;
    dto.password = req.body.password;

    return dto;
  }

  static async validate(dto: InputDto): Promise<string[] | null> {
    const validation = await super.validate(dto);

    return validation;
  }
}
