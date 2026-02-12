import { Transaction } from "@app/Domain/Entities/Transaction"
import { Security } from "@app/Domain/Services/Security"

export class TransactionFactory {
  static create(data: {
    amount: number
    createdAt: Date
    entryId: string
    transactionGroupDueId: string
    userId: string
  }): Transaction {
    return {
      id: Security.getUlid(),
      amount: data.amount,
      createdAt: data.createdAt,
      entryId: data.entryId,
      transactionGroupDueId: data.transactionGroupDueId,
      userId: data.userId,
    }
  }
}
