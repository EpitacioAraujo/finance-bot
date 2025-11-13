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
      type: "postgres",
      host: this.env.dbPostgresHost,
      port: Number(this.env.dbPostgresPort),
      username: this.env.dbPostgresUser,
      password: this.env.dbPostgresPassword,
      database: this.env.dbPostgresDb,
      synchronize: false,
      logging: true,
      entities: [UserEntity, EntryEntity],
      subscribers: [],
      migrations: [],
    });
  }
}
