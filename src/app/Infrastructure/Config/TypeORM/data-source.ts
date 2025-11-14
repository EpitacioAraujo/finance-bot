import { DataSource } from "typeorm";
import { Env } from "@app/Domain/Entities/Env";
import { UserEntity } from "./Entities/UserEntity";
import { EntryEntity } from "./Entities/EntryEntity";

export class AppDataSourceFactory {
  public dataSource: DataSource;

  constructor(private env: Env) {
    this.dataSource = this.make();
  }

  private make() {
    return new DataSource({
      type: this.env.dbType as any,
      host: this.env.dbHost,
      port: Number(this.env.dbPort),
      username: this.env.dbUser,
      password: this.env.dbPassword,
      database: this.env.dbName,
      synchronize: false,
      logging: true,
      entities: [UserEntity, EntryEntity],
      subscribers: [],
      migrations: [],
    });
  }
}
