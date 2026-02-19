import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { BaseClassValidatorDto } from '@/infrastructure/crud-controller/nestjs/BaseClassValidatorDto';
import type { Request } from 'express';

export class UpdatePaymentTypeDto extends BaseClassValidatorDto {
  @IsString({ message: 'Id deve ser texto' })
  @IsNotEmpty({ message: 'Id é obrigatório' })
  id: string;

  @IsString({ message: 'Nome deve ser texto' })
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  @IsOptional()
  name?: string;
  
  @IsString({ message: 'Descrição deve ser texto' })
  @MinLength(5, { message: 'Descrição deve ter pelo menos 5 caracteres' })
  @IsOptional()
  description?: string;
  
  @IsEnum(['weekly', 'biweekly', 'monthly', 'yearly'], {
    message: 'cycle_type deve ser weekly, biweekly, monthly ou yearly',
  })
  @IsOptional()
  cycle_type?: 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  
  @IsNumber(
    {},
    {
      message: 'cycle_day_start deve ser numérico',
    },
  )
  @IsOptional()
  cycle_day_start?: number;
  
  @IsNumber(
    {},
    {
      message: 'cycle_day_end deve ser numérico',
    },
  )
  @IsOptional()
  cycle_day_end?: number;

  static parse(req: Request): UpdatePaymentTypeDto {
    const dto = new UpdatePaymentTypeDto();
    dto.id = String(req.params.id);

    if (req.body.name !== undefined) {
      dto.name = req.body.name;
    }
    if (req.body.description !== undefined) {
      dto.description = req.body.description;
    }
    if (req.body.cycle_type !== undefined) {
      dto.cycle_type = req.body.cycle_type;
    }
    if (req.body.cycle_day_start !== undefined) {
      dto.cycle_day_start = Number(req.body.cycle_day_start);
    }
    if (req.body.cycle_day_end !== undefined) {
      dto.cycle_day_end = Number(req.body.cycle_day_end);
    }

    return dto;
  }

  static async validate(
    dto: UpdatePaymentTypeDto,
  ): Promise<string[] | null> {
    return super.validate(dto);
  }
}
