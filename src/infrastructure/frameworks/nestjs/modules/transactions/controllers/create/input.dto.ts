import { InputDTO as TransactionCreateInputDTO } from '@/application/use-cases/transaction/create/input.dto'
import { IsNumber, IsNotEmpty, IsEnum, IsString, IsOptional, IsDateString } from 'class-validator';

export class InputDTO implements TransactionCreateInputDTO {
    @IsNumber(
        {},
        {
            message: 'Valor deve ser numérico',
        },
    )
    @IsNotEmpty({
        message: 'Valor é obrigatório',
    })
    amount: number;

    @IsEnum(['income', 'outcome'], {
        message: 'Tipo deve ser income ou outcome',
    })
    @IsNotEmpty({
        message: 'Tipo é obrigatório',
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
    executionDate?: Date;

    @IsString({ message: 'paymentTypeId deve ser texto' })
    @IsNotEmpty({ message: 'paymentTypeId é obrigatório' })
    paymentTypeId: string;

    @IsString({ message: 'paymentCycleId deve ser texto' })
    @IsNotEmpty({ message: 'paymentCycleId é obrigatório' })
    paymentCycleId: string;
    
    @IsNumber(
        {},
        {
            message: 'Quantidade de vezes deve ser inteiro',
        },
    )
    times?: number | undefined;

    constructor(
        props: {
            amount: number,
            type: 'income' | 'outcome',
            description: string,
            executionDate: Date | undefined,
            paymentTypeId: string,
            paymentCycleId: string,
            times?: number | undefined
        }
    ) {
        this.amount = props.amount;
        this.type = props.type;
        this.description = props.description;
        this.executionDate = props.executionDate;
        this.paymentTypeId = props.paymentTypeId;
        this.paymentCycleId = props.paymentCycleId;
        this.times = props.times;
    }
}