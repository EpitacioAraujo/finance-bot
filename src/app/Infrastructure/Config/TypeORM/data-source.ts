import { DataSource } from "typeorm";
import { UserEntity } from "./Entities/UserEntity";
import { EntryEntity } from "./Entities/EntryEntity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env["DB_POSTGRES_HOST"],
  port: Number(process.env["DB_POSTGRES_PORT"]),
  username: process.env["DB_POSTGRES_USER"],
  password: process.env["DB_POSTGRES_PASSWORD"],
  database: process.env["DB_POSTGRES_DB"],
  synchronize: false,
  logging: true,
  entities: [UserEntity, EntryEntity],
  subscribers: [],
  migrations: [],
});
