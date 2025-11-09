import express from "express";

import dotenv from "dotenv";
import path from "node:path";

import { WhatsAppMessageRecive } from "@app/WebHooks/MetaAPI/WhatsappMessageRecive";
import { WhatsAppWebHookValidation } from "./WebHooks/MetaAPI/WhatsAppWebHookValidation";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();

app.use(express.json());

app.get("/whatsapp", WhatsAppWebHookValidation);

app.post("/whatsapp", WhatsAppMessageRecive);

app.listen(process.env["PORT"] || 3000, () => {
  console.log("Server is running...");
});
