import "reflect-metadata";
import express from "express";

import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

import { WhatsAppMessageRecive } from "@app/Infrastructure/WebHooks/MetaAPI/WhatsappMessageRecive";
import { WhatsAppWebHookValidation } from "@app/Infrastructure/WebHooks/MetaAPI/WhatsAppWebHookValidation";
import { AppDataSource } from "./Infrastructure/Config/TypeORM/data-source";
import UserRepository from "./Infrastructure/Repositories/TypeORM/UserRepository";

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
(async () => {
  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.log(error);
  }
})();

const app = express();

app.use(express.json());

app.get("/whatsapp", WhatsAppWebHookValidation);

app.post("/whatsapp", WhatsAppMessageRecive);

app.get("/teste", async (_, res) => {
  const allUsers = await UserRepository.find();
  res.json(allUsers);
});

app.listen(process.env["PORT"] || 3000, () => {
  console.log("Server is running...");
});
