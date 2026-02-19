import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { BaseClassValidatorDto } from '@/infrastructure/crud-controller/nestjs/BaseClassValidatorDto';
import type { Request } from 'express';

export class CreatePaymentTypeDto extends BaseClassValidatorDto {
  @IsString({ message: 'Nome deve ser texto' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  name: string;
  
  @IsEnum(['weekly', 'biweekly', 'monthly', 'yearly'], {
    message: 'cycle_type deve ser weekly, biweekly, monthly ou yearly',
  })
  cycle_type: 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  
  @IsNumber(
    {},
    {
      message: 'cycle_day_start deve ser numérico',
    },
  )
  cycle_day_start: number;
  
  @IsNumber(
    {},
    {
      message: 'cycle_day_end deve ser numérico',
    },
  )
  cycle_day_end: number;

  static parse(req: Request): CreatePaymentTypeDto {
    const dto = new CreatePaymentTypeDto();
    
    dto.name = req.body.name;
    dto.cycle_type = req.body.cycle_type;
    dto.cycle_day_start = Number(req.body.cycle_day_start);
    dto.cycle_day_end = Number(req.body.cycle_day_end);
    
    return dto;
  }

  static async validate(
    dto: CreatePaymentTypeDto,
  ): Promise<string[] | null> {
    return super.validate(dto);
  }
}
