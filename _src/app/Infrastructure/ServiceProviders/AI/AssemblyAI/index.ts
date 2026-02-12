import "reflect-metadata"
import { injectable } from "tsyringe"
import { AssemblyAI } from "assemblyai"

@injectable()
export class AssemblyAIServiceProvider {
  private client: AssemblyAI

  constructor() {
    this.client = new AssemblyAI({
      apiKey: process.env["ASSEMBLYAI_API_KEY"] || "",
    })
  }

  async audioTranscribe(audioUrl: string): Promise<string> {
    const transcription = await this.client.transcripts.transcribe({
      audio: audioUrl,
      language_code: "pt",
    })

    return String(transcription.text)
  }
}
