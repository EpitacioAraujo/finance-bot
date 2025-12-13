import { TransactionGroup } from "@app/Domain/Entities/TransactionGroup"
import { Security } from "@app/Domain/Services/Security"

export class TransactionGroupFactory {
  static create(data: {
    name: string
    createdAt: Date
    cicleType: "instant" | "monthly"
    closingDay?: string
    userId: string
  }): TransactionGroup {
    return {
      id: Security.getUlid(),
      name: data.name,
      createdAt: data.createdAt,
      cicleType: data.cicleType,
      closingDay: data.closingDay,
      userId: data.userId,
    }
  }
}
