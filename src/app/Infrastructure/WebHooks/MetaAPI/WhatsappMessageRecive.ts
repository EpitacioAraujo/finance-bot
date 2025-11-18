import { IntentService } from "@app/Application/Intent/IntentService";
import type { TEntryRepository } from "@app/Infrastructure/Repositories/TypeORM/EntryRepository";
import type { TUserRepository } from "@app/Infrastructure/Repositories/TypeORM/UserRepository";
import { AssemblyAIService } from "@app/Infrastructure/Services/AI/AssemblyAI";
import { WhatsAppMetaAPI } from "@app/Infrastructure/Services/WhatsApp/MetaAPI";
import { Request, Response } from "express";
import { randomBytes } from "node:crypto";

type MessageDetails = {
  from: string;
  type: string;
  textContent?: string;
  audioId?: string;
};

export class WhatsAppMessageReceiveHandler {
  constructor(
    private readonly entryRepository: TEntryRepository,
    private readonly userRepository: TUserRepository,
    private readonly whatsAppMetaAPI: WhatsAppMetaAPI,
    private readonly assemblyAIService: AssemblyAIService,
    private intentService: IntentService | null = null
  ) {}

  public async handle(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).send("OK");

      const changeValue = req.body?.entry?.[0]?.changes?.[0]?.value;

      if (!changeValue) {
        console.log("Received webhook without change value payload");
        return;
      }

      const statuses = changeValue.statuses;
      if (Array.isArray(statuses) && statuses.length > 0) {
        console.log("Status update received:", statuses);
        return;
      }

      if (req.body?.object !== "whatsapp_business_account") {
        console.log("Ignoring unsupported webhook object:", req.body?.object);
        return;
      }

      const messageDetails = this.extractMessageDetails(changeValue);
      if (!messageDetails) {
        console.log("No message details found in payload");
        return;
      }

      const messageContent = await this.getMessageContent(messageDetails);

      if (!messageContent.trim()) {
        await this.whatsAppMetaAPI.sendMessage(
          messageDetails.from,
          "Não conseguimos processar sua mensagem. Pode tentar novamente?"
        );
        return;
      }

      const intent = await this.getIntentService().analyze(messageContent);

      if (intent.action === "register_entry") {
        const entryPayload = intent.entry;

        if (!entryPayload) {
          throw new Error(
            "register_entry action returned without entry payload"
          );
        }

        const entryType: 1 | 0 = entryPayload.type === "income" ? 1 : 0;

        const existingUser = await this.userRepository.findOne({
          where: { numberPhone: messageDetails.from },
        });

        const user =
          existingUser ??
          (await this.userRepository.save(
            this.userRepository.create({
              id: randomBytes(13).toString("hex"),
              username: messageDetails.from,
              numberPhone: messageDetails.from,
            })
          ));

        const entry = this.entryRepository.create({
          id: randomBytes(13).toString("hex"),
          date: new Date(),
          description: entryPayload.description,
          amount: entryPayload.value,
          type: entryType,
          userId: user.id,
          user,
        });

        await this.entryRepository.save(entry);

        await this.whatsAppMetaAPI.sendMessage(
          messageDetails.from,
          "Entrada registrada com sucesso!"
        );

        return;
      }

      await this.whatsAppMetaAPI.sendMessage(
        messageDetails.from,
        "Desculpe, não conseguimos entender sua solicitação. Pode repetir por favor?"
      );
    } catch (error) {
      console.error("Error processing WhatsApp message:", error);
    }
  }

  private getIntentService(): IntentService {
    if (!this.intentService) {
      this.intentService = new IntentService();
    }

    return this.intentService;
  }

  private extractMessageDetails(changeValue: any): MessageDetails | null {
    const message = changeValue?.messages?.[0];

    if (!message?.from || !message?.type) {
      return null;
    }

    return {
      from: message.from,
      type: message.type,
      textContent: message.text?.body,
      audioId: message.audio?.id,
    };
  }

  private async getMessageContent(details: MessageDetails): Promise<string> {
    if (details.type === "text" && details.textContent) {
      return details.textContent;
    }

    if (details.type === "audio") {
      if (!details.audioId) {
        throw new Error("Audio message missing media identifier");
      }

      const audioUrl = await this.whatsAppMetaAPI.getMediaUrl(details.audioId);
      const audioPath = await this.whatsAppMetaAPI.audioDownload(
        audioUrl,
        details.audioId
      );
      return this.assemblyAIService.transcribeMessage(audioPath);
    }

    return details.textContent ?? "";
  }
}
