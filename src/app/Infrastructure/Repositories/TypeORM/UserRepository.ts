import { UserEntity } from "@app/Infrastructure/Config/TypeORM/Entities/UserEntity";
import { DataSource } from "typeorm";

class UserRepositoryFactory {
  constructor(private appDataSource: DataSource) {}

  public make() {
    return this.appDataSource.getRepository(UserEntity);
  }
}

export default UserRepositoryFactory;

export type TUserRepository = ReturnType<UserRepositoryFactory["make"]>;
