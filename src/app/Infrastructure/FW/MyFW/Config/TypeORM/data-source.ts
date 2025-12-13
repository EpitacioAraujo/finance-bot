import { DataSource } from "typeorm"
import { Env } from "@app/Domain/Entities/Env"
import { UserEntity } from "./Entities/UserEntity"
import { EntryEntity } from "./Entities/EntryEntity"

export class AppDataSourceFactory {
  constructor(private env: Env) {}

  public async make(): Promise<DataSource> {
    console.log("Initializing database connection...")

    const sqliteConnection = {
      type: this.env.dbType as any,
      database: this.env.dbName,
    }

    const postgresConnection = {
      type: this.env.dbType as any,
      host: this.env.dbHost,
      port: Number(this.env.dbPort),
      username: this.env.dbUser,
      password: this.env.dbPassword,
      database: this.env.dbName,
    }

    console.log(
      this.env.dbType === "sqlite" ? sqliteConnection : postgresConnection
    )

    const dataSource = new DataSource({
      ...(this.env.dbType === "sqlite" ? sqliteConnection : postgresConnection),
      synchronize: this.env.dbType === "sqlite" ? true : false,
      logging: false,
      entities: [UserEntity, EntryEntity],
      subscribers: [],
      migrations: [],
    })

    await dataSource.initialize()

    return dataSource
  }
}
