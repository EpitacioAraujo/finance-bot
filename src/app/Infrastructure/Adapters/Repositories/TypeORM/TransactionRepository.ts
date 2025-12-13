import { Transaction } from "@app/Domain/Entities/Transaction"
import { TransactionRepository } from "@app/Domain/Ports/Repositories/TransactionRepository"
import { TransactionEntity } from "@app/Infrastructure/FW/MyFW/Config/TypeORM/Entities/TransactionEntity"
import { DataSource, Repository } from "typeorm"

export class TypeOrmTransactionRepository implements TransactionRepository {
  private repository: Repository<TransactionEntity>

  constructor(appDataSource: DataSource) {
    this.repository = appDataSource.getRepository(TransactionEntity)
  }

  public async register(data: Transaction) {
    await this.repository.save(data)
    return true
  }

  public async getAll(): Promise<Transaction[]> {
    return await this.repository.find()
  }
}
