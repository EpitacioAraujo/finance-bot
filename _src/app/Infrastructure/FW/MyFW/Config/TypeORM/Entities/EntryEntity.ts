import { Entry } from "@app/Domain/Entities/Entry"
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from "typeorm"
import { UserEntity } from "./UserEntity"

@Entity({
  name: "entries",
})
export class EntryEntity implements Entry {
  @PrimaryColumn({ type: "varchar", length: 52 })
  id!: string

  @Column({ type: process.env.NODE_ENV === "test" ? "datetime" : "timestamp" })
  date!: Date

  @Column({ type: "varchar", length: 255 })
  description!: string

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number

  @Column({ type: "smallint" })
  type!: 1 | 0

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity

  @RelationId((entry: EntryEntity) => entry.user)
  userId!: string
}
