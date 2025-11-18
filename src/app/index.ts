import "reflect-metadata";
import express from "express";

import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

import { DataSource } from "typeorm";

import { Env } from "@app/Domain/Entities/Env";
import { LoadDashBoardUseCase } from "@app/Application/UseCases/LoadDashBoard";
import { AppDataSourceFactory } from "@app/Infrastructure/Config/TypeORM/data-source";
import EntryRepositoryFactory, {
  TEntryRepository,
} from "@app/Infrastructure/Repositories/TypeORM/EntryRepository";
import UserRepositoryFactory, {
  TUserRepository,
} from "@app/Infrastructure/Repositories/TypeORM/UserRepository";
import { WhatsAppMessageReceiveHandler } from "@app/Infrastructure/WebHooks/MetaAPI/WhatsappMessageRecive";
import { WhatsAppWebHookValidation } from "@app/Infrastructure/WebHooks/MetaAPI/WhatsAppWebHookValidation";
import { WhatsAppMetaAPI } from "@app/Infrastructure/Services/WhatsApp/MetaAPI";
import { AssemblyAIService } from "@app/Infrastructure/Services/AI/AssemblyAI";

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
let appDataSource: DataSource;
let entryRepository: TEntryRepository;
let userRepository: TUserRepository;
let whatsAppMessageHandler: WhatsAppMessageReceiveHandler | null = null;
(async () => {
  try {
    appDataSource = await new AppDataSourceFactory(
      new Env()
    ).dataSource.initialize();
    entryRepository = new EntryRepositoryFactory(appDataSource).make();
    userRepository = new UserRepositoryFactory(appDataSource).make();
    whatsAppMessageHandler = new WhatsAppMessageReceiveHandler(
      entryRepository,
      userRepository,
      new WhatsAppMetaAPI(),
      new AssemblyAIService()
    );
  } catch (error) {
    console.log(error);
  }
})();

const app = express();

app.use(express.json());

app.get("/whatsapp", WhatsAppWebHookValidation);

app.post("/whatsapp", (req, res) => {
  if (!whatsAppMessageHandler) {
    res.status(503).send("Service unavailable");
    return;
  }

  return whatsAppMessageHandler.handle(req, res);
});

app.get("/teste", async (_, res) => {
  const allUsers = await userRepository.find();
  res.json(allUsers);
});

app.get("/dash/:phoneNumber", async (req, res) => {
  const phoneNumber = req.params.phoneNumber;
  const tipo = String(req.query["tipo"] ?? "todos");
  const ordenar = String(req.query["ordenar"] ?? "data");
  const ordem = String(req.query["ordem"] ?? "desc");

  const user = await userRepository.findOne({
    where: { numberPhone: phoneNumber },
  });

  if (!user) {
    res
      .status(404)
      .send(
        `<h1>Usuário não encontrado</h1><p>Nenhum usuário cadastrado com o número ${phoneNumber}.</p>`
      );
    return;
  }

  const loadDashBoardUseCase = new LoadDashBoardUseCase(entryRepository);
  const html = await loadDashBoardUseCase.execute({
    user,
    ordenar,
    ordem,
    tipo,
  });
  res.send(html);
});

app.listen(process.env["PORT"] || 3000, () => {
  console.log(`Server is running on port ${process.env["PORT"] || 3000}`);
});
