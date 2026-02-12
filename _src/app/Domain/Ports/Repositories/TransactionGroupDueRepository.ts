import { TransactionGroupDue } from "@app/Domain/Entities/TransactionGroupDue"

export abstract class TransactionGroupDueRepository {
  abstract register(data: TransactionGroupDue): Promise<boolean>
}
