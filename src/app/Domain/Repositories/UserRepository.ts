import { User } from "@app/Domain/Entities/User";

export interface UserRepository {
  register(data: User): Promise<boolean>;
  findAll(): Promise<User[]>;
}
