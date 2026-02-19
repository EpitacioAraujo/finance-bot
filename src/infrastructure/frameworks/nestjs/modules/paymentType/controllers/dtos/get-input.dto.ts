import { IsNotEmpty, IsString } from 'class-validator';
import { BaseClassValidatorDto } from '@/infrastructure/crud-controller/nestjs/BaseClassValidatorDto';
import { Request } from 'express';

export class GetPaymentTypeDto extends BaseClassValidatorDto {
  @IsString({
    message: 'Id deve ser texto',
  })
  @IsNotEmpty({
    message: 'Id é obrigatório',
  })
  id: string;

  static parse(data: Request): GetPaymentTypeDto {
    const dto = new GetPaymentTypeDto();
    dto.id = String(data.params.id);
    return dto;
  }

  static async validate(dto: GetPaymentTypeDto): Promise<string[] | null> {
    return super.validate(dto);
  }
}
