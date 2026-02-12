export interface TransactionGroupDue {
  id: string
  name: string
  status: "standby" | "current" | "closed" | "payed"
  dueDate: Date
  createdAt: Date
  transactionGroupId: string
  userId: string
  nextTransactionGroupDueId?: string
}
