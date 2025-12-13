export abstract class AIProviderPort {
  abstract sendCompletion(
    messages: { role: string; content: string }[]
  ): Promise<string>
  abstract audioTranscription(audioPath: string): Promise<string>
}
