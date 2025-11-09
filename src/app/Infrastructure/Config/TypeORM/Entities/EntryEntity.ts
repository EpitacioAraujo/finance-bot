import { Entry } from "@app/Domain/Entities/Entry";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
  name: "entries",
})
export class EntryEntity implements Entry {
  @PrimaryColumn()
  id!: string;

  @Column({ type: "timestamp" })
  date!: Date;

  @Column({ type: "varchar", length: 255 })
  description!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: "enum", enum: ["income", "expense"] })
  type!: "income" | "expense";
}
