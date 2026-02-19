import { Entity } from "@/common/domain/entity";
export class Transaction extends Entity{
    public amount: number;
    public description: string;
    public type: 'income' | 'outcome';
    public executionDate: Date;
    public paymentTypeId: string;
    public paymentCycleId: string;

    constructor(props: {
        amount: number;
        type: 'income' | 'outcome';
        description: string;
        executionDate?: Date;
        paymentTypeId: string;
        paymentCycleId: string;
        id?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        });
        this.amount = props.amount;
        this.description = props.description;
        this.type = props.type;
        this.executionDate = props.executionDate || new Date();
        this.paymentTypeId = props.paymentTypeId;
        this.paymentCycleId = props.paymentCycleId;
    }
} 