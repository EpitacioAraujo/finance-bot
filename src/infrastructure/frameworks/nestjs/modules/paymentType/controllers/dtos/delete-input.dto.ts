import { IsNotEmpty, IsString } from 'class-validator';
import { BaseClassValidatorDto } from '@/infrastructure/crud-controller/nestjs/BaseClassValidatorDto';

export class DeletePaymentTypeDto extends BaseClassValidatorDto {
  @IsString({
    message: 'Id deve ser texto',
  })
  @IsNotEmpty({
    message: 'Id é obrigatório',
  })
  id: string;

  static parse(data: { id?: string }): DeletePaymentTypeDto {
    const dto = new DeletePaymentTypeDto();
    dto.id = String(data.id);
    return dto;
  }

  static async validate(
    dto: DeletePaymentTypeDto,
  ): Promise<string[] | null> {
    return super.validate(dto);
  }
}
