import { AIProviderPort } from "@app/Domain/Ports/Providers/AIProvider"
import { AssemblyAIServiceProvider } from "@app/Infrastructure/ServiceProviders/AI/AssemblyAI"
import { DeepSeekServiceProvider } from "@app/Infrastructure/ServiceProviders/AI/Deepseek"
import { IMessage } from "@app/Infrastructure/ServiceProviders/AI/Deepseek/types/Message"

export class AiProvider implements AIProviderPort {
  async sendCompletion(
    messages: { role: string; content: string }[]
  ): Promise<string> {
    return new DeepSeekServiceProvider().sendCompletion(
      messages as Array<IMessage>,
      {
        temperature: 0,
        response_format: { type: "json_object" },
      }
    )
  }

  async audioTranscription(audioPath: string): Promise<string> {
    return new AssemblyAIServiceProvider().audioTranscribe(audioPath)
  }
}
