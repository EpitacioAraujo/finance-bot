export interface Entry {
  id: string
  date: Date
  description: string
  amount: number
  type: 1 | 0
  userId: string
}
