import { TransactionGroupDue } from "@app/Domain/Entities/TransactionGroupDue"
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from "typeorm"
import { TransactionGroupEntity } from "./TransactionGroupEntity"
import { UserEntity } from "./UserEntity"

@Entity({
  name: "transaction_group_dues",
})
export class TransactionGroupDueEntity implements TransactionGroupDue {
  @PrimaryColumn({ type: "varchar", length: 52 })
  id!: string

  @Column({ type: "varchar", length: 255 })
  name!: string

  @Column({ type: "varchar", length: 20 })
  status!: "standby" | "current" | "closed" | "payed"

  @Column({ name: "due_date", type: "timestamp" })
  dueDate!: Date

  @Column({ name: "created_at", type: "timestamp" })
  createdAt!: Date

  @ManyToOne(() => TransactionGroupEntity, { nullable: false })
  @JoinColumn({ name: "transaction_group_id" })
  transactionGroup!: TransactionGroupEntity

  @RelationId(
    (transactionGroupDue: TransactionGroupDueEntity) =>
      transactionGroupDue.transactionGroup
  )
  transactionGroupId!: string

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity

  @RelationId(
    (transactionGroupDue: TransactionGroupDueEntity) => transactionGroupDue.user
  )
  userId!: string

  @ManyToOne(() => TransactionGroupDueEntity, { nullable: true })
  @JoinColumn({ name: "next_transaction_group_due_id" })
  nextTransactionGroupDue?: TransactionGroupDueEntity

  @RelationId(
    (transactionGroupDue: TransactionGroupDueEntity) =>
      transactionGroupDue.nextTransactionGroupDue
  )
  nextTransactionGroupDueId?: string
}
