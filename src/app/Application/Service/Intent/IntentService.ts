import OpenAI from "openai";
import { z } from "zod";

const EntrySchema = z.object({
  type: z.enum(["income", "expense"]),
  value: z.number().positive(),
  description: z.string().min(3),
});

const IntentSchema = z
  .object({
    action: z.enum(["register_entry", "unknown_action"]),
    entry: EntrySchema.nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.action === "register_entry" && !data.entry) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "register_entry action requires entry payload",
        path: ["entry"],
      });
    }

    if (data.action === "unknown_action" && data.entry) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "unknown_action must not include entry",
        path: ["entry"],
      });
    }
  });

export type IntentResult = z.infer<typeof IntentSchema>;

export class IntentService {
  private client: OpenAI;
  private model: string;

  constructor(model = process.env["DEEPSEEK_MODEL"] || "deepseek-chat") {
    const apiKey = process.env["DEEPSEEK_API_KEY"];

    if (!apiKey) {
      throw new Error("DEEPSEEK_API_KEY environment variable is not set");
    }

    this.client = new OpenAI({
      apiKey,
      baseURL: "https://api.deepseek.com",
    });
    this.model = model;
  }

  async analyze(message: string): Promise<IntentResult> {
    if (!message.trim()) {
      return { action: "unknown_action", entry: null };
    }

    const response = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente financeiro. Responda estritamente em JSON. Quando não entender, retorne action=unknown_action e entry igual a null.",
        },
        {
          role: "user",
          content: [
            "Analise a mensagem do usuário e produza uma resposta JSON que obedece ao schema.",
            "Campos esperados:",
            "action: register_entry ou unknown_action.",
            "Quando action=register_entry, inclua entry.type (income|expense), entry.value (número) e entry.description (string).",
            "Quando action=unknown_action, retorne action=unknown_action e entry=null.",
            `Mensagem do usuário: "${message}"`,
          ].join("\n"),
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Intent response had no content");
    }

    let parsedJson: unknown;

    try {
      parsedJson = JSON.parse(content);
    } catch (error) {
      throw new Error(
        `Unable to parse intent JSON: ${(error as Error).message}`
      );
    }

    const intent = IntentSchema.parse(parsedJson);

    return {
      action: intent.action,
      entry: intent.entry,
    } satisfies IntentResult;
  }
}
