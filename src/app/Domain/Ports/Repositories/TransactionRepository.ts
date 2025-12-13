import { Transaction } from "@app/Domain/Entities/Transaction"

export interface TransactionRepository {
  register(data: Transaction): Promise<boolean>
}
