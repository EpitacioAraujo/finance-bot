import { Entry } from "@app/Domain/Entities/Entry";
import { EntryEntity } from "@app/Infrastructure/Config/TypeORM/Entities/EntryEntity";
import { EntryRepository } from "@app/Domain/Repositories/EntryRepository";
import { DataSource } from "typeorm";

export class EntryRepositoryFactory {
  constructor(private appDataSource: DataSource) {}

  public make(): EntryRepository {
    const repository = this.appDataSource.getRepository(EntryEntity);
    return {
      register: async (data: Entry) => {
        await repository.save(data);
        return true;
      },
    };
  }
}
