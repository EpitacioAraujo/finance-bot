import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { BaseClassValidatorDto } from '@/infrastructure/crud-controller/nestjs/BaseClassValidatorDto';
import type { Request } from 'express';

export class CreateTransactionDto extends BaseClassValidatorDto {
  @IsNumber(
    {},
    {
      message: 'Valor deve ser numérico',
    },
  )
  amount: number;

  @IsEnum(['income', 'outcome'], {
    message: 'Tipo deve ser income ou outcome',
  })
  type: 'income' | 'outcome';

  @IsString({
    message: 'Descrição deve ser texto',
  })
  @IsNotEmpty({
    message: 'Descrição é obrigatória',
  })
  description: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de execução inválida' })
  executionDate?: string;

  static parse(req: Request): CreateTransactionDto {
    const dto = new CreateTransactionDto();
    dto.amount = Number(req.body.amount);
    dto.type = req.body.type;
    dto.description = req.body.description;
    dto.executionDate = req.body.executionDate;
    return dto;
  }

  static async validate(
    dto: CreateTransactionDto,
  ): Promise<string[] | null> {
    return super.validate(dto);
  }
}
