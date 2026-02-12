import { CommandMessage } from "@app/Domain/Entities/CommandMessage"
import { WhatsAppMetaAPI } from "../Api"
import { CommandMessageFactory } from "@app/Domain/Factories/CommandMessageFactory"

export class MessageMapper {
  whatsAppMetaAPI = new WhatsAppMetaAPI()

  public async execute(payload: any): Promise<CommandMessage> {
    const changeValue = payload?.entry?.[0]?.changes?.[0]?.value

    const statuses = changeValue?.statuses
    if (Array.isArray(statuses) && statuses.length > 0) {
      console.log("Status update received:", statuses)
      throw new Error("Status update - no further processing needed")
    }

    if (payload?.object !== "whatsapp_business_account") {
      console.log("Ignoring unsupported webhook object:", payload?.object)
      throw new Error("Unsupported webhook object")
    }

    let audioPath = null

    if (payload.type === "audio") {
      const audioUrl = await this.whatsAppMetaAPI.getMediaUrl(payload.audio?.id)
      audioPath = await this.whatsAppMetaAPI.audioDownload(audioUrl)
    }

    return CommandMessageFactory.create({
      from: payload.from,
      contentType: payload.type,
      content: payload.type === "text" ? payload.text?.body || "" : "",
      audioPath: audioPath,
      "meta-data": payload,
    })
  }
}
