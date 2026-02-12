import { TransactionGroup } from "@app/Domain/Entities/TransactionGroup"
import { TransactionGroupEntity } from "@app/Infrastructure/FW/MyFW/Config/TypeORM/Entities/TransactionGroupEntity"
import { TransactionGroupRepository } from "@app/Domain/Ports/Repositories/TransactionGroupRepository"
import { DataSource, Repository } from "typeorm"

export class TypeOrmTransactionGroupRepository implements TransactionGroupRepository {
  private repository: Repository<TransactionGroupEntity>

  constructor(appDataSource: DataSource) {
    this.repository = appDataSource.getRepository(TransactionGroupEntity)
  }

  public async register(data: TransactionGroup) {
    await this.repository.save(data)
    return true
  }
}
