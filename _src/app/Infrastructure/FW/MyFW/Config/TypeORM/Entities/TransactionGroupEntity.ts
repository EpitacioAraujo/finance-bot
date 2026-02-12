import { TransactionGroup } from "@app/Domain/Entities/TransactionGroup"
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
  name: "transaction_groups",
})
export class TransactionGroupEntity implements TransactionGroup {
  @PrimaryColumn({ type: "varchar", length: 52 })
  id!: string

  @Column({ type: "varchar", length: 255 })
  name!: string

  @Column({ name: "created_at", type: "timestamp" })
  createdAt!: Date

  @Column({ name: "cicle_type", type: "varchar", length: 20 })
  cicleType!: "instant" | "monthly"

  @Column({ name: "closing_day", type: "varchar", length: 10, nullable: true })
  closingDay?: string

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity

  @RelationId(
    (transactionGroup: TransactionGroupEntity) => transactionGroup.user
  )
  userId!: string
}
