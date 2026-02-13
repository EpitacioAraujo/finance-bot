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

export class UpdateTransactionDto extends BaseClassValidatorDto {
  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'Valor deve ser numérico',
    },
  )
  amount?: number;

  @IsOptional()
  @IsEnum(['income', 'outcome'], {
    message: 'Tipo deve ser income ou outcome',
  })
  type?: 'income' | 'outcome';

  @IsOptional()
  @IsString({
    message: 'Descrição deve ser texto',
  })
  @IsNotEmpty({
    message: 'Descrição é obrigatória',
  })
  description?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de execução inválida' })
  executionDate?: string;

  id?: string;

  static parse(req: Request): UpdateTransactionDto {
    const dto = new UpdateTransactionDto();
    dto.id = String(req.params.id);
    if (req.body.amount !== undefined) {
      dto.amount = Number(req.body.amount);
    }
    if (req.body.type !== undefined) {
      dto.type = req.body.type;
    }
    if (req.body.description !== undefined) {
      dto.description = req.body.description;
    }
    if (req.body.executionDate !== undefined) {
      dto.executionDate = req.body.executionDate;
    }
    return dto;
  }

  static async validate(
    dto: UpdateTransactionDto,
  ): Promise<string[] | null> {
    return super.validate(dto);
  }
}
