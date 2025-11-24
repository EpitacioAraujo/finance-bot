import { injectable } from "tsyringe";
import { DataSource, Repository } from "typeorm";

import { Entry } from "@app/Domain/Entities/Entry";
import { EntryRepository } from "@app/Domain/Ports/Repositories/EntryRepository";

import { EntryEntity } from "@MyFW/Config/TypeORM/Entities/EntryEntity";

@injectable()
export class EntryRepositoryFactory {
  private repository: Repository<EntryEntity>;

  constructor(appDataSource: DataSource) {
    this.repository = appDataSource.getRepository(EntryEntity);
  }

  public make(): EntryRepository {
    return {
      register: this.register.bind(this),
      getAll: this.getAll.bind(this),
    };
  }

  private async register(data: Entry) {
    await this.repository.save(data);
    return true;
  }

  private async getAll(): Promise<Entry[]> {
    const entries = await this.repository.find();
    return entries.map<Entry>(e => ({
      type: e.type ? 'income' : 'expense',
      value: e.amount,
      description: e.description,
    }) as any);
  }
}
