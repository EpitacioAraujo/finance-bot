import { EntryEntity } from "@app/Infrastructure/Config/TypeORM/Entities/EntryEntity";
import { DataSource } from "typeorm";

class EntryRepositoryFactory {
  constructor(private appDataSource: DataSource) {}

  public make() {
    return this.appDataSource.getRepository(EntryEntity);
  }
}

export default EntryRepositoryFactory;
