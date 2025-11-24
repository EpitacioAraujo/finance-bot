export interface AIProviderPort {
  sendCompletion(
    messages: { role: string; content: string }[]
  ): Promise<string>;
  audioTranscription(audioPath: string): Promise<string>;
}
