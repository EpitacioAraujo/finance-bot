import { Transaction } from "@app/Domain/Entities/Transaction"

export abstract class TransactionRepository {
  abstract register(data: Transaction): Promise<boolean>
}
