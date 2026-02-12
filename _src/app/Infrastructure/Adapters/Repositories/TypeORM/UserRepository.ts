import { injectable } from "tsyringe"
import { User } from "@app/Domain/Entities/User"
import { UserRepository } from "@app/Domain/Ports/Repositories/UserRepository"
import { UserEntity } from "@app/Infrastructure/FW/MyFW/Config/TypeORM/Entities/UserEntity"
import { DataSource, Repository } from "typeorm"

@injectable()
export class TypeOrmUserRepository implements UserRepository {
  private repository: Repository<UserEntity>

  constructor(appDataSource: DataSource) {
    this.repository = appDataSource.getRepository(UserEntity)
  }

  public async register(data: User) {
    await this.repository.save(data)
    return true
  }

  public async getAll(): Promise<User[]> {
    return await this.repository.find()
  }
}
