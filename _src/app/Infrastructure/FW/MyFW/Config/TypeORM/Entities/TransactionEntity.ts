import { Transaction } from "@app/Domain/Entities/Transaction"
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from "typeorm"
import { EntryEntity } from "./EntryEntity"
import { UserEntity } from "./UserEntity"

@Entity({
  name: "transactions",
})
export class TransactionEntity implements Transaction {
  @PrimaryColumn({ type: "varchar", length: 52 })
  id!: string

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number

  @Column({ name: "created_at", type: "timestamp" })
  createdAt!: Date

  @ManyToOne(() => EntryEntity, { nullable: false })
  @JoinColumn({ name: "entry_id" })
  entry!: EntryEntity

  @RelationId((transaction: TransactionEntity) => transaction.entry)
  entryId!: string

  @Column({ name: "transaction_group_due_id", type: "varchar", length: 52 })
  transactionGroupDueId!: string

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity

  @RelationId((transaction: TransactionEntity) => transaction.user)
  userId!: string
}
