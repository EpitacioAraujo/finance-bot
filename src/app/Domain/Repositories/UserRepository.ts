import { User } from "@app/Domain/Entities/User";

export type CreateUserInput = {
  id: string;
  username: string;
  numberPhone: string;
};

export interface UserRepository {
  findByPhoneNumber(numberPhone: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(data: CreateUserInput): User;
  save(user: User): Promise<User>;
}
