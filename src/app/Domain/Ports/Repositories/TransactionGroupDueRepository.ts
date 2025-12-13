import { TransactionGroupDue } from "@app/Domain/Entities/TransactionGroupDue"

export interface TransactionGroupDueRepository {
  register(data: TransactionGroupDue): Promise<boolean>
}
