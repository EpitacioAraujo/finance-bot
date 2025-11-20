import { TransactionGroupDue } from "@app/Domain/Entities/TransactionGroupDue";
import { TransactionGroupDueEntity } from "@app/Infrastructure/Config/TypeORM/Entities/TransactionGroupDueEntity";
import { TransactionGroupDueRepository } from "@app/Domain/Repositories/TransactionGroupDue";
import { DataSource } from "typeorm";

export class TransactionGroupDueRepositoryFactory {
  constructor(private appDataSource: DataSource) {}

  public make(): TransactionGroupDueRepository {
    const repository = this.appDataSource.getRepository(
      TransactionGroupDueEntity
    );
    return {
      register: async (data: TransactionGroupDue) => {
        await repository.save(data);
        return true;
      },
    };
  }
}
