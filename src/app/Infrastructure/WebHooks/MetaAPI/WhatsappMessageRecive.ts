import { IntentService } from "@app/Application/Intent/IntentService";
import EntryRepository from "@app/Infrastructure/Repositories/TypeORM/EntryRepository";
import UserRepository from "@app/Infrastructure/Repositories/TypeORM/UserRepository";
import { AssemblyAIService } from "@app/Infrastructure/Services/AI/AssemblyAI";
import { WhatsAppMetaAPI } from "@app/Infrastructure/Services/WhatsApp/MetaAPI";
import { Request, Response } from "express";
import { randomBytes } from "node:crypto";

let intentService: IntentService | null = null;

function getIntentService(): IntentService {
  if (!intentService) {
    intentService = new IntentService();
  }

  return intentService;
}

export async function WhatsAppMessageRecive(req: Request, res: Response) {
  try {
    res.status(200).send("OK");

    const statuses = req.body.entry[0].changes[0].value.statuses;

    if (statuses && statuses.length > 0) {
      console.log("Status update received:", statuses);
      return;
    }

    if (req.body.object !== "whatsapp_business_account") {
      console.log(req.body.object);
      return;
    }

    const whatsAppMetaAPI = new WhatsAppMetaAPI();
    const assemblyAIService = new AssemblyAIService();

    const { from, type, textContent, audio_id } = extractMessageDetails(req);

    const messageContent = await getMessageContent(
      { whatsAppMetaAPI, assemblyAIService },
      {
        type,
        textContent,
        audio_id,
      }
    );

    const intent = await getIntentService().analyze(messageContent);

    if (intent.action === "register_entry") {
      const entryPayload = intent.entry;

      if (!entryPayload) {
        throw new Error("register_entry action returned without entry payload");
      }

      const entryType: 1 | 0 = entryPayload.type === "income" ? 1 : 0;

      const existingUser = await UserRepository.findOne({
        where: { numberPhone: from },
      });

      const user =
        existingUser ??
        (await UserRepository.save(
          UserRepository.create({
            id: randomBytes(13).toString("hex"),
            username: from,
            numberPhone: from,
          })
        ));

      const entry = EntryRepository.create({
        id: randomBytes(13).toString("hex"),
        date: new Date(),
        description: entryPayload.description,
        amount: entryPayload.value,
        type: entryType,
        userId: user.id,
        user,
      });

      await EntryRepository.save(entry);

      await whatsAppMetaAPI.sendMessage(
        from,
        "Entrada registrada com sucesso!"
      );

      return;
    }

    await whatsAppMetaAPI.sendMessage(
      from,
      "Desculpe, não conseguimos entender sua solicitação. Pode repetir por favor?"
    );
  } catch (error) {
    console.error("Error processing WhatsApp message:", error);
  }
}

function extractMessageDetails(req: Request) {
  const from = req.body.entry[0].changes[0].value.messages[0].from;
  const type = req.body.entry[0].changes[0].value.messages[0].type;
  const textContent = req.body.entry[0].changes[0].value.messages[0].text?.body;
  const { id: audio_id } =
    req.body.entry[0].changes[0].value.messages[0].audio || {};
  return { from, type, textContent, audio_id };
}

type GetMessageContentDependencies = {
  whatsAppMetaAPI: WhatsAppMetaAPI;
  assemblyAIService: AssemblyAIService;
};

type GetMessageContentPayload = {
  type: string;
  textContent: string;
  audio_id: string;
};

async function getMessageContent(
  dependencies: GetMessageContentDependencies,
  payload: GetMessageContentPayload
) {
  let messageContent = "";

  if (payload.type === "text") {
    messageContent = payload.textContent;
  }

  if (payload.type === "audio") {
    const audioUrl = await dependencies.whatsAppMetaAPI.getMediaUrl(
      payload.audio_id
    );
    const audioPath = await dependencies.whatsAppMetaAPI.audioDownload(
      audioUrl,
      payload.audio_id
    );
    messageContent =
      await dependencies.assemblyAIService.transcribeMessage(audioPath);
  }
  return messageContent;
}
