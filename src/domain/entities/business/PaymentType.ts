import { Entity } from "@/common/domain/entity";

export class PaymentType extends Entity {
    public name: string;
    public cycle_type: 'weekly' | 'biweekly' | 'monthly' | 'yearly';
    public cycle_day_start: number;
    public cycle_day_end: number;
    
    constructor(props: {
        name: string;
        cycle_type: 'weekly' | 'biweekly' | 'monthly' | 'yearly';
        cycle_day_start: number;
        cycle_day_end: number;
        id?: string;
        created_at?: Date;
        updated_at?: Date;
    }) {
        super({
            id: props.id,
            createdAt: props.created_at,
            updatedAt: props.updated_at,
        });
        this.name = props.name;
        this.cycle_type = props.cycle_type;
        this.cycle_day_start = props.cycle_day_start;
        this.cycle_day_end = props.cycle_day_end;
    }
}
