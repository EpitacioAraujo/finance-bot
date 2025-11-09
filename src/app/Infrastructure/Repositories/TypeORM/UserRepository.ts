import { AppDataSource } from "@app/Infrastructure/Config/TypeORM/data-source";
import { UserEntity } from "@app/Infrastructure/Config/TypeORM/Entities/UserEntity";

const UserRepository = AppDataSource.getRepository(UserEntity);

export default UserRepository;
