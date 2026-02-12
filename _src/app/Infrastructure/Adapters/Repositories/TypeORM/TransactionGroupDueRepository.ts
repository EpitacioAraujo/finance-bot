import { TransactionGroupDue } from "@app/Domain/Entities/TransactionGroupDue"
import { TransactionGroupDueEntity } from "@app/Infrastructure/FW/MyFW/Config/TypeORM/Entities/TransactionGroupDueEntity"
import { TransactionGroupDueRepository } from "@app/Domain/Ports/Repositories/TransactionGroupDueRepository"
import { DataSource, Repository } from "typeorm"

export class TypeOrmTransactionGroupDueRepository implements TransactionGroupDueRepository {
  private repository: Repository<TransactionGroupDueEntity>

  constructor(appDataSource: DataSource) {
    this.repository = appDataSource.getRepository(TransactionGroupDueEntity)
  }

  public async register(data: TransactionGroupDue) {
    await this.repository.save(data)
    return true
  }
}
