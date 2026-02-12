import "reflect-metadata"
import { injectable } from "tsyringe"
import OpenAI, { type OpenAI as TOpenAI } from "openai"
import { IMessage } from "./types/Message"

@injectable()
export class DeepSeekServiceProvider {
  private client: OpenAI

  constructor() {
    this.client = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env["DEEPSEEK_API_KEY"] || "",
    })
  }

  async sendCompletion(
    messages: Array<IMessage>,
    config?: Omit<
      TOpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
      "model" | "messages"
    >
  ): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "deepseek-chat",
      messages,
      ...config,
    })

    return response.choices?.[0]?.message.content || ""
  }
}
