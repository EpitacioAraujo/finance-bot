import { injectable } from "tsyringe"
import { DataSource, Repository } from "typeorm"

import { Entry } from "@app/Domain/Entities/Entry"
import { EntryRepository } from "@app/Domain/Ports/Repositories/EntryRepository"

import { EntryEntity } from "@MyFW/Config/TypeORM/Entities/EntryEntity"

@injectable()
export class TypeOrmEntryRepository implements EntryRepository {
  private repository: Repository<EntryEntity>

  constructor(appDataSource: DataSource) {
    this.repository = appDataSource.getRepository(EntryEntity)
  }

  public async register(data: Entry) {
    await this.repository.save(data)
    return true
  }

  public async getAll(): Promise<Entry[]> {
    const entries = await this.repository.find()
    return entries.map<Entry>(
      (e) =>
        ({
          type: e.type ? "income" : "expense",
          value: e.amount,
          description: e.description,
        }) as any
    )
  }
}
