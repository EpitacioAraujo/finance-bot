import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { BaseClassValidatorDto } from '@/infrastructure/crud-controller/nestjs/BaseClassValidatorDto';
import { Request } from 'express';
import { InputDTO as RegisterInputDTO } from '@/application/use-cases/auth/register/input.dto';

export class InputDto
  extends BaseClassValidatorDto
  implements RegisterInputDTO
{
  @IsString({
    message: 'Nome deve ser um texto',
  })
  @IsNotEmpty({
    message: 'Nome é obrigatório',
  })
  name: string;

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

  @IsEmail(
    {},
    {
      message: 'Email deve ser um endereço de email válido',
    },
  )
  @IsNotEmpty({
    message: 'Email é obrigatório',
  })
  confirmEmail: string;

  @IsString({
    message: 'Senha deve ser um texto',
  })
  @IsNotEmpty({
    message: 'Senha é obrigatória',
  })
  password: string;

  @IsString({
    message: 'Confirmação de senha deve ser um texto',
  })
  @IsNotEmpty({
    message: 'Confirmação de senha é obrigatória',
  })
  confirmPassword: string;

  static parse(req: Request): InputDto {
    const dto = new InputDto();

    dto.name = req.body.name;
    dto.email = req.body.email;
    dto.confirmEmail = req.body.confirmEmail;
    dto.password = req.body.password;
    dto.confirmPassword = req.body.confirmPassword;

    return dto;
  }

  static async validate(dto: InputDto): Promise<string[] | null> {
    const errors: string[] = [];

    const validation = await super.validate(dto);

    validation?.forEach((error) => {
      errors.push(error[0]);
    });

    return Promise.resolve(errors.length > 0 ? errors : null);
  }
}
