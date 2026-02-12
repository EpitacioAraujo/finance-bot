import { CommandMessage } from "../Entities/CommandMessage"
import { Security } from "../Services/Security"

interface InputDTO {
  from: string
  contentType: "text" | "audio"
  content: string
  audioPath: string | null
  "meta-data": any
}

export class CommandMessageFactory {
  static create(input: InputDTO): CommandMessage {
    return {
      id: Security.getUlid(),
      from: input.from,
      contentType: input.contentType,
      content: input.content,
      audioPath: input.audioPath,
      "meta-data": input["meta-data"],
    }
  }
}
