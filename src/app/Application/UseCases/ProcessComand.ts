import "reflect-metadata";

import { CommandMessage } from "@app/Domain/Entities/CommandMessage";

import z from "zod";
import { AIProviderPort } from "@app/Domain/Ports/Providers/AIProvider";
import { AiPrompts } from "@app/Domain/Utils";
import { EntryRepository } from "@app/Domain/Ports/Repositories/EntryRepository";

interface InputDTO {
  commandMessage: CommandMessage;
}

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

export class ProcessCommandUseCase {
  constructor(
    private entryRepository: EntryRepository,
    private aIProvider: AIProviderPort
  ) { }

  public async execute(data: InputDTO): Promise<any> {
    return this.entryRepository.getAll();

    if (!data.commandMessage.content && !data.commandMessage.audioPath) {
      throw new Error("No content to process");
    }

    const userCommand = data.commandMessage.content
      ? data.commandMessage.content
      : await this.aIProvider.audioTranscription(
        data.commandMessage.audioPath!
      );

    const result = await this.aIProvider.sendCompletion([
      {
        role: "system",
        content: AiPrompts.COMMAND_CLASSIFICATION,
      },
      {
        role: "user",
        content: userCommand,
      },
    ]);

    if (!result) {
      throw new Error("Intent response had no content");
    }

    let parsedJson: unknown;

    try {
      parsedJson = JSON.parse(result);
    } catch (error) {
      throw new Error(
        `Unable to parse intent JSON: ${(error as Error).message}`
      );
    }

    const intent = IntentSchema.parse(parsedJson);

    console.log("Parsed intent:", {
      action: intent.action,
      entry: intent.entry,
    } satisfies IntentResult);

    return true;
  }
}
