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
    console.log("Initializing database connection...");
    console.log(`Database type: ${this.env.dbType}`);
    console.log(`Database host: ${this.env.dbHost}`);
    console.log(`Database port: ${this.env.dbPort}`);
    console.log(`Database name: ${this.env.dbName}`);
    console.log(`Database user: ${this.env.dbUser}`);

    const dataSource = new DataSource({
      type: this.env.dbType as any,
      host: this.env.dbHost,
      port: Number(this.env.dbPort),
      username: this.env.dbUser,
      password: this.env.dbPassword,
      database: this.env.dbName,
      synchronize: false,
      logging: true,
      entities: [UserEntity, EntryEntity],
      ssl:
        this.env.dbType === "postgres" ? { rejectUnauthorized: false } : false,
      subscribers: [],
      migrations: [],
    });

    dataSource
      .initialize()
      .then(() => {
        console.log("Database connection established successfully");
      })
      .catch((error) => {
        console.error("Database connection failed:", error);
      });

    return dataSource;
  }
}
