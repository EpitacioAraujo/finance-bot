import { Entry } from "@app/Domain/Entities/Entry"

export abstract class EntryRepository {
  abstract register(data: Entry): Promise<boolean>
  abstract getAll(): Promise<Entry[]>
}
