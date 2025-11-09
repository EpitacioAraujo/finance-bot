import { AssemblyAIService } from "@app/Services/AI/AssemblyAI";
import { DeepSeekService } from "@app/Services/AI/Deepseek";
import { PromptBuilder } from "@app/Services/AI/Deepseek/promptBuilder";
import { WhatsAppMetaAPI } from "@app/Services/WhatsApp/MetaAPI";
import { Request, Response } from "express";

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
    const deepSeekService = new DeepSeekService();

    const from = req.body.entry[0].changes[0].value.messages[0].from;
    const type = req.body.entry[0].changes[0].value.messages[0].type;
    const textContent =
      req.body.entry[0].changes[0].value.messages[0].text?.body;
    const { id: audio_id } =
      req.body.entry[0].changes[0].value.messages[0].audio || {};

    let messageContent = "";

    if (type === "text") {
      messageContent = textContent;
    }

    if (type === "audio") {
      const audioUrl = await whatsAppMetaAPI.getMediaUrl(audio_id);
      const audioPath = await whatsAppMetaAPI.audioDownload(audioUrl, audio_id);
      messageContent = await assemblyAIService.transcribeMessage(audioPath);
    }

    const prompt =
      PromptBuilder.buildCommandClassificationPrompt(messageContent);

    const analyze = await deepSeekService.sendChat(prompt);

    const response = `
      Here is the analysis of your message:
      ${analyze}
    `;

    whatsAppMetaAPI.sendMessage(from, response.trim());
  } catch (error) {
    console.error("Error processing WhatsApp message:", error);
  }
}
