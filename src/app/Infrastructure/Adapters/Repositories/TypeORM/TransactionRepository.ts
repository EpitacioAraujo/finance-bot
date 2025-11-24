import { Transaction } from "@app/Domain/Entities/Transaction";
import { TransactionRepository } from "@app/Domain/Ports/Repositories/Transaction";
import { TransactionEntity } from "@app/Infrastructure/FW/MyFW/Config/TypeORM/Entities/TransactionEntity";
import { DataSource } from "typeorm";

export class TransactionRepositoryFactory {
  constructor(private appDataSource: DataSource) {}

  public make(): TransactionRepository {
    const repository = this.appDataSource.getRepository(TransactionEntity);

    return {
      register: async (data: Transaction) => {
        await repository.save(data);
        return true;
      },
    };
  }
}
