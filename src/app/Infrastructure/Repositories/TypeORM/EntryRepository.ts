import { AppDataSource } from "@app/Infrastructure/Config/TypeORM/data-source";
import { EntryEntity } from "@app/Infrastructure/Config/TypeORM/Entities/EntryEntity";

const EntryRepository = AppDataSource.getRepository(EntryEntity);

export default EntryRepository;
