import { TransactionGroupDue } from "@app/Domain/Entities/TransactionGroupDue";
import { Security } from "@app/Domain/Services/Security";

export class TransactionGroupDueFactory {
  static create(data: {
    name: string;
    status: "standby" | "current" | "closed" | "payed";
    dueDate: Date;
    createdAt: Date;
    transactionGroupId: string;
    userId: string;
    nextTransactionGroupDueId?: string;
  }): TransactionGroupDue {
    return {
      id: Security.getUlid(),
      name: data.name,
      status: data.status,
      dueDate: data.dueDate,
      createdAt: data.createdAt,
      transactionGroupId: data.transactionGroupId,
      userId: data.userId,
      nextTransactionGroupDueId: data.nextTransactionGroupDueId,
    };
  }
}
