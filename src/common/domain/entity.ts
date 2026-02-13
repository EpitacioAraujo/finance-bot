import { ulid } from "ulid";

export abstract class Entity {
    public id: string;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(props: {
        id?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        this.id = props.id || ulid();
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }
}