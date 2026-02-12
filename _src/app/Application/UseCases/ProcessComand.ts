import "reflect-metadata"

import { CommandMessage } from "@app/Domain/Entities/CommandMessage"

import { AIProviderPort } from "@app/Domain/Ports/Providers/AIProvider"
import { WhatsAppProviderPort } from "@app/Domain/Ports/Providers/WhatsAppProviderPort"

export interface InputDTO {
  commandMessage: CommandMessage
}

export class ProcessCommandUseCase {
  constructor(
    private aiProviderPort: AIProviderPort,
    private whatsAppProvider: WhatsAppProviderPort
  ) {}

  public async execute(data: InputDTO): Promise<any> {
    if (!data.commandMessage.content && !data.commandMessage.audioPath) {
      throw new Error("No content to process")
    }

    const userCommand = data.commandMessage.content
      ? data.commandMessage.content
      : await this.aiProviderPort.audioTranscription(
          data.commandMessage.audioPath!
        )

    this.whatsAppProvider.sendTextMessage(
      data.commandMessage.from,
      `Comando recebido: ${userCommand}`
    )

    console.log("User Command:", userCommand)

    return true
  }
}
