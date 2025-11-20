import { Entry } from "@app/Domain/Entities/Entry";

export interface EntryRepository {
  register(data: Entry): Promise<boolean>;
}
