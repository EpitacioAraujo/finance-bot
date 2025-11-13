import "reflect-metadata";
import express from "express";

import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

import { Env } from "@app/Domain/Entities/Env";

import { WhatsAppMessageRecive } from "@app/Infrastructure/WebHooks/MetaAPI/WhatsappMessageRecive";
import { WhatsAppWebHookValidation } from "@app/Infrastructure/WebHooks/MetaAPI/WhatsAppWebHookValidation";

import { AppDataSourceFactory } from "./Infrastructure/Config/TypeORM/data-source";

import EntryRepositoryFactory from "./Infrastructure/Repositories/TypeORM/EntryRepository";
import UserRepositoryFactory from "./Infrastructure/Repositories/TypeORM/UserRepository";
import { DataSource, Repository } from "typeorm";
import { Entry } from "./Domain/Entities/Entry";
import { User } from "./Domain/Entities/User";

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
let appDataSource: DataSource;
let entryRepository: Repository<Entry>;
let userRepository: Repository<User>;
(async () => {
  try {
    appDataSource = await new AppDataSourceFactory(
      new Env()
    ).dataSource.initialize();
    entryRepository = new EntryRepositoryFactory(appDataSource).make();
    userRepository = new UserRepositoryFactory(appDataSource).make();
  } catch (error) {
    console.log(error);
  }
})();

const app = express();

app.use(express.json());

app.get("/whatsapp", WhatsAppWebHookValidation);

app.post("/whatsapp", WhatsAppMessageRecive);

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

  const sortMap: Record<string, string> = {
    data: "entry.date",
    valor: "entry.amount",
    tipo: "entry.type",
  };

  const orderBy = sortMap[ordenar] ?? sortMap["data"] ?? "entry.date";
  const orderDirection: "ASC" | "DESC" =
    ordem.toLowerCase() === "asc" ? "ASC" : "DESC";

  const query = entryRepository
    .createQueryBuilder("entry")
    .where("entry.user_id = :userId", { userId: user.id })
    .orderBy(orderBy, orderDirection);

  if (tipo === "entrada") {
    query.andWhere("entry.type = :type", { type: 1 });
  } else if (tipo === "despesa") {
    query.andWhere("entry.type = :type", { type: 0 });
  }

  const entries = await query.getMany();

  const moeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  const formatDate = (value: Date) =>
    new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(value);

  const escapeHtml = (value: string) =>
    value.replace(/[&<>'"]/g, (char) => {
      const map: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return map[char] ?? char;
    });

  const rows = entries
    .map((entry: any) => {
      const isIncome = !!entry.type;
      return `
        <tr>
          <td>${formatDate(entry.date)}</td>
          <td>${escapeHtml(entry.description)}</td>
          <td class="valor ${isIncome ? "entrada" : "despesa"}">${moeda.format(entry.amount)}</td>
          <td>${isIncome ? "Entrada" : "Despesa"}</td>
        </tr>
      `;
    })
    .join("");

  const tableBody =
    rows || '<tr><td colspan="4">Nenhum lançamento encontrado.</td></tr>';

  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>Painel Financeiro</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 2rem; color: #1f2933; }
          h1 { margin-bottom: 1rem; }
          form { display: flex; gap: 1rem; align-items: flex-end; margin-bottom: 1.5rem; }
          label { display: flex; flex-direction: column; font-size: 0.9rem; color: #52606d; }
          select, button { padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid #cbd2d9; }
          button { background-color: #2563eb; color: #fff; cursor: pointer; border: none; }
          button:hover { background-color: #1d4ed8; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e4e7eb; }
          th { background-color: #f5f7fa; }
          tr:hover { background-color: #f1f5f9; }
          .valor { font-weight: 600; }
          .valor.entrada { color: #047857; }
          .valor.despesa { color: #b91c1c; }
        </style>
      </head>
      <body>
        <h1>Lançamentos de ${escapeHtml(user.username)}</h1>
        <p>Número: ${escapeHtml(user.numberPhone)}</p>
        <form method="get">
          <label>
            Tipo
            <select name="tipo">
              <option value="todos" ${tipo === "todos" ? "selected" : ""}>Todos</option>
              <option value="entrada" ${tipo === "entrada" ? "selected" : ""}>Entradas</option>
              <option value="despesa" ${tipo === "despesa" ? "selected" : ""}>Despesas</option>
            </select>
          </label>
          <label>
            Ordenar por
            <select name="ordenar">
              <option value="data" ${ordenar === "data" ? "selected" : ""}>Data</option>
              <option value="valor" ${ordenar === "valor" ? "selected" : ""}>Valor</option>
              <option value="tipo" ${ordenar === "tipo" ? "selected" : ""}>Tipo</option>
            </select>
          </label>
          <label>
            Ordem
            <select name="ordem">
              <option value="desc" ${ordem === "desc" ? "selected" : ""}>Descendente</option>
              <option value="asc" ${ordem === "asc" ? "selected" : ""}>Ascendente</option>
            </select>
          </label>
          <button type="submit">Aplicar</button>
        </form>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            ${tableBody}
          </tbody>
        </table>
      </body>
    </html>
  `);
});

app.listen(process.env["PORT"] || 3000, () => {
  console.log(`Server is running on port ${process.env["PORT"] || 3000}`);
});
