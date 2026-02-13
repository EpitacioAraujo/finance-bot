import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseClassValidatorDto } from '@/infrastructure/crud-controller/nestjs/BaseClassValidatorDto';
import type { Request } from 'express';

const getQueryValue = (value: unknown): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? String(value[0]) : undefined;
  }
  return String(value);
};

const toNumber = (value: string | undefined): number | undefined => {
  if (value === undefined || value === '') {
    return undefined;
  }
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? undefined : numberValue;
};

const toDate = (value: string | undefined): Date | undefined => {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export class SearchTransactionsDto extends BaseClassValidatorDto {
  @IsOptional()
  @IsString({
    message: 'Id deve ser texto',
  })
  id?: string;

  @IsOptional()
  @IsEnum(['income', 'outcome'], {
    message: 'Tipo deve ser income ou outcome',
  })
  type?: 'income' | 'outcome';

  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'Valor mínimo deve ser numérico',
    },
  )
  minAmount?: number;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'Valor máximo deve ser numérico',
    },
  )
  maxAmount?: number;

  @IsOptional()
  @IsDate({
    message: 'Data de início inválida',
  })
  executionDateFrom?: Date;

  @IsOptional()
  @IsDate({
    message: 'Data de fim inválida',
  })
  executionDateTo?: Date;

  @IsOptional()
  @IsString({
    message: 'Descrição deve ser texto',
  })
  description?: string;

  static parse(req: Request): SearchTransactionsDto {
    const dto = new SearchTransactionsDto();
    const query = req.query ?? {};

    dto.id = getQueryValue(query.id);
    dto.type = getQueryValue(query.type) as 'income' | 'outcome' | undefined;
    dto.minAmount = toNumber(getQueryValue(query.minAmount));
    dto.maxAmount = toNumber(getQueryValue(query.maxAmount));
    dto.executionDateFrom = toDate(getQueryValue(query.executionDateFrom));
    dto.executionDateTo = toDate(getQueryValue(query.executionDateTo));
    dto.description = getQueryValue(query.description);

    return dto;
  }

  static async validate(
    dto: SearchTransactionsDto,
  ): Promise<string[] | null> {
    return super.validate(dto);
  }
}
