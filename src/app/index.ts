import express, { Request, Response } from "express";

import dotenv from "dotenv";
import path from "node:path";

import { WhatsAppMessageRecive } from "./webhooks/MetaAPI/WhatsappMessageRecive";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();

app.use(express.json());

app.get("/whatsapp", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  const verifyToken = process.env["WHATSAPP_API_TOKEN_VERIFY_TOKEN"];

  if (mode === "subscribe" && token === verifyToken) {
    console.log("✅ WEBHOOK VERIFIED");
    return res.status(200).send(challenge);
  }

  console.log("❌ WEBHOOK VERIFICATION FAILED");
  return res.status(403).send("Forbidden");
});

app.post("/whatsapp", WhatsAppMessageRecive);

app.listen(process.env["PORT"] || 3000, () => {
  console.log("Server is running...");
});
