import {
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

export class SearchPaymentTypeDto extends BaseClassValidatorDto {
  @IsOptional()
  @IsString({
    message: 'Id deve ser texto',
  })
  id?: string;

  static parse(req: Request): SearchPaymentTypeDto {
    const dto = new SearchPaymentTypeDto();
    const query = req.query ?? {};

    dto.id = getQueryValue(query.id);

    return dto;
  }

  static async validate(
    dto: SearchPaymentTypeDto,
  ): Promise<string[] | null> {
    return super.validate(dto);
  }
}
