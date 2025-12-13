import { User } from "@app/Domain/Entities/User"
import { Security } from "@app/Domain/Services/Security"

export class UserFactory {
  static create(data: { username: string; numberPhone: string }): User {
    return {
      id: Security.getUlid(),
      username: data.username,
      numberPhone: data.numberPhone,
    }
  }
}
