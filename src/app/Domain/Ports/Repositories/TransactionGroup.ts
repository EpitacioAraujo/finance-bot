import { TransactionGroup } from "@app/Domain/Entities/TransactionGroup";

export interface TransactionGroupRepository {
  register(data: TransactionGroup): Promise<boolean>;
}
