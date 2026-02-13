import { IsNotEmpty, IsString } from 'class-validator';
import { BaseClassValidatorDto } from '@/infrastructure/crud-controller/nestjs/BaseClassValidatorDto';

export class GetTransactionDto extends BaseClassValidatorDto {
  @IsString({
    message: 'Id deve ser texto',
  })
  @IsNotEmpty({
    message: 'Id é obrigatório',
  })
  id: string;

  static parse(data: { id?: string }): GetTransactionDto {
    const dto = new GetTransactionDto();
    dto.id = String(data.id);
    return dto;
  }

  static async validate(dto: GetTransactionDto): Promise<string[] | null> {
    return super.validate(dto);
  }
}
