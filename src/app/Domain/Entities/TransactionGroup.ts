export interface TransactionGroup {
  id: string
  name: string
  createdAt: Date
  cicleType: "instant" | "monthly"
  closingDay?: string
  userId: string
}
