import { AIProviderPort } from "@app/Domain/Ports/Providers/AIProvider"
import { AiPrompts } from "@app/Domain/Utils"
import z from "zod"

const EntrySchema = z.object({
  type: z.enum(["income", "expense"]),
  value: z.number().positive(),
  description: z.string().min(3),
})

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
      })
    }

    if (data.action === "unknown_action" && data.entry) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "unknown_action must not include entry",
        path: ["entry"],
      })
    }
  })

export type IntentResult = z.infer<typeof IntentSchema>

export async function getIntentFromAI(
  userCommand: string,
  aiProvider: AIProviderPort
): Promise<void> {
  const result = await aiProvider.sendCompletion([
    {
      role: "system",
      content: AiPrompts.COMMAND_CLASSIFICATION,
    },
    {
      role: "user",
      content: userCommand,
    },
  ])

  if (!result) {
    throw new Error("Intent response had no content")
  }

  let parsedJson: unknown

  try {
    parsedJson = JSON.parse(result)
  } catch (error) {
    throw new Error(`Unable to parse intent JSON: ${(error as Error).message}`)
  }

  const intent = IntentSchema.parse(parsedJson)

  console.log("Parsed intent:", {
    action: intent.action,
    entry: intent.entry,
  } satisfies IntentResult)
}
