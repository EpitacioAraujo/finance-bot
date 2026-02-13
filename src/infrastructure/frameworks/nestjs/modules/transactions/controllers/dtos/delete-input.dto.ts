import { IsNotEmpty, IsString } from 'class-validator';
import { BaseClassValidatorDto } from '@/infrastructure/crud-controller/nestjs/BaseClassValidatorDto';

export class DeleteTransactionDto extends BaseClassValidatorDto {
  @IsString({
    message: 'Id deve ser texto',
  })
  @IsNotEmpty({
    message: 'Id é obrigatório',
  })
  id: string;

  static parse(data: { id?: string }): DeleteTransactionDto {
    const dto = new DeleteTransactionDto();
    dto.id = String(data.id);
    return dto;
  }

  static async validate(
    dto: DeleteTransactionDto,
  ): Promise<string[] | null> {
    return super.validate(dto);
  }
}
