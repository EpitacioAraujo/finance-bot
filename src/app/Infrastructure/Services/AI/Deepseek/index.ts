import OpenAI from "openai";

export class DeepSeekService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env["DEEPSEEK_API_KEY"] || "",
    });
  }

  async sendChat(text: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: text,
        },
      ],
    });

    return response.choices?.[0]?.message.content || "";
  }
}
