import { AppDataSource } from "@app/Config/TypeORM/data-source";
import { UserEntity } from "@app/Config/TypeORM/Entities/UserEntity";

const UserRepository = AppDataSource.getRepository(UserEntity);

export default UserRepository;
