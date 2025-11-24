import { TransactionGroup } from "@app/Domain/Entities/TransactionGroup";
import { TransactionGroupEntity } from "@app/Infrastructure/FW/MyFW/Config/TypeORM/Entities/TransactionGroupEntity";
import { TransactionGroupRepository } from "@app/Domain/Ports/Repositories/TransactionGroup";
import { DataSource } from "typeorm";

export class TransactionGroupRepositoryFactory {
  constructor(private appDataSource: DataSource) {}

  public make(): TransactionGroupRepository {
    const repository = this.appDataSource.getRepository(TransactionGroupEntity);
    return {
      register: async (data: TransactionGroup) => {
        await repository.save(data);
        return true;
      },
    };
  }
}
