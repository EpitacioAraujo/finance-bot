import { Entry } from "@app/Domain/Entities/Entry"
import { Security } from "@app/Domain/Services/Security"

export class EntryFactory {
  static create(data: {
    date: Date
    description: string
    amount: number
    type: 1 | 0
    userId: string
  }): Entry {
    return {
      id: Security.getUlid(),
      date: data.date,
      description: data.description,
      amount: data.amount,
      type: data.type,
      userId: data.userId,
    }
  }
}
