import { User } from "@app/Domain/Entities/User";
import { UserRepository } from "@app/Domain/Repositories/UserRepository";
import { UserEntity } from "@app/Infrastructure/Config/TypeORM/Entities/UserEntity";
import { DataSource } from "typeorm";

export class UserRepositoryFactory {
  constructor(private appDataSource: DataSource) {}

  public make(): UserRepository {
    const repository = this.appDataSource.getRepository(UserEntity);
    return {
      register: async (data: User) => {
        await repository.save(data);
        return true;
      },
      findAll: async (): Promise<User[]> => {
        return await repository.find();
      },
    };
  }
}
