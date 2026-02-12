export interface Transaction {
  id: string
  amount: number
  createdAt: Date
  entryId: string
  transactionGroupDueId: string
  userId: string
}
