export interface Entry {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: "income" | "expense";
}
