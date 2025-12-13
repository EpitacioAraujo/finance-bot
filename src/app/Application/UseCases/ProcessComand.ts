import "reflect-metadata"

import { CommandMessage } from "@app/Domain/Entities/CommandMessage"

import { AIProviderPort } from "@app/Domain/Ports/Providers/AIProvider"

export interface InputDTO {
  commandMessage: CommandMessage
}

export class ProcessCommandUseCase {
  constructor(private AIProviderPort: AIProviderPort) {}

  public async execute(data: InputDTO): Promise<any> {
    if (!data.commandMessage.content && !data.commandMessage.audioPath) {
      throw new Error("No content to process")
    }

    const userCommand = data.commandMessage.content
      ? data.commandMessage.content
      : await this.AIProviderPort.audioTranscription(
          data.commandMessage.audioPath!
        )

    console.log("User Command:", userCommand)

    return true
  }
}
