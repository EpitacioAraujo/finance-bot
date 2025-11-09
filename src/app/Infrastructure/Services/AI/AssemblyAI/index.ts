import { AssemblyAI } from "assemblyai";

export class AssemblyAIService {
  private client: AssemblyAI;

  constructor() {
    this.client = new AssemblyAI({
      apiKey: process.env["ASSEMBLYAI_API_KEY"] || "",
    });
  }

  async transcribeMessage(audioUrl: string): Promise<string> {
    const transcription = await this.client.transcripts.transcribe({
      audio: audioUrl,
      language_code: "pt",
    });

    return String(transcription.text);
  }
}
