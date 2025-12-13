import { TransactionGroup } from "@app/Domain/Entities/TransactionGroup"

export abstract class TransactionGroupRepository {
  abstract register(data: TransactionGroup): Promise<boolean>
}
