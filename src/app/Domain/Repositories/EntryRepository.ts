import { Entry } from "@app/Domain/Entities/Entry";
import { User } from "@app/Domain/Entities/User";

export type CreateEntryInput = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 1 | 0;
  userId: string;
  user?: User;
};

export type EntryListFilters = {
  userId: string;
  ordenar: "data" | "valor" | "tipo";
  ordem: "asc" | "desc";
  tipo: "todos" | "entrada" | "despesa";
};

export interface EntryRepository {
  create(data: CreateEntryInput): Entry;
  save(entry: Entry): Promise<Entry>;
  listByFilters(filters: EntryListFilters): Promise<Entry[]>;
}
