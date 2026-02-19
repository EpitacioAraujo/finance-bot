export type InputDTO = {
    amount: number;
    type: 'income' | 'outcome';
    description: string;
    executionDate?: Date;
    paymentTypeId: string;
    times?: number;
}