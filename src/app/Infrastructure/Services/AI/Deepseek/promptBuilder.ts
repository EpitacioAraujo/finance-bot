export class PromptBuilder {
  static buildCommandClassificationPrompt(userMessage: string): string {
    return `Analyze the following user message and classify it into one of the following commands. Respond with only the command name:

ADD_EXPENSE: Record spending (amount, description, category)
ADD_INCOME: Record earnings (amount, description, source)
CHECK_BALANCE: Get current financial status
LIST_TRANSACTIONS: View recent transactions (with filters)
HELP: Provide guidance or list available commands
UNKNOW: The request is not available by us

User message: ${userMessage}`;
  }
}
