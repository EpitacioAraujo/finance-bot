import { AIProviderPort } from "@app/Domain/Ports/Providers/AIProvider";
import { AssemblyAIService } from "@app/Infrastructure/ServiceProviders/AI/AssemblyAI";
import { DeepSeekService } from "@app/Infrastructure/ServiceProviders/AI/Deepseek";
import { IMessage } from "@app/Infrastructure/ServiceProviders/AI/Deepseek/types/Message";

export class AiProvider implements AIProviderPort {
  async sendCompletion(
    messages: { role: string; content: string }[]
  ): Promise<string> {
    return new DeepSeekService().sendCompletion(messages as Array<IMessage>, {
      temperature: 0,
      response_format: { type: "json_object" },
    });
  }

  async audioTranscription(audioPath: string): Promise<string> {
    return new AssemblyAIService().audioTranscribe(audioPath);
  }
}
