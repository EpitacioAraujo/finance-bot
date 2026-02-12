import { User } from "@app/Domain/Entities/User"

export abstract class UserRepository {
  abstract register(data: User): Promise<boolean>
  abstract getAll(): Promise<User[]>
}
