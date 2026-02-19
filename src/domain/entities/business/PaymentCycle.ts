import { Entity } from "@/common/domain/entity";
export class PaymentCycle extends Entity {
    public name: string;
    public description: string;
    public start_date: Date;
    public end_date: Date;
    public paymentTypeId: string;

    constructor(props: {
        id?: string;
        start_date: Date;
        end_date: Date;
        paymentTypeId: string;
        created_at?: Date;
        updated_at?: Date;
    }) {
        super({
            id: props.id,
            createdAt: props.created_at,
            updatedAt: props.updated_at,
        });
        this.start_date = props.start_date;
        this.end_date = props.end_date;
        this.paymentTypeId = props.paymentTypeId;
    }
}