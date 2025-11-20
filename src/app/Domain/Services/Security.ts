import { ulid } from "ulid";

export class Security {
  static getUlid(): string {
    return ulid();
  }
}
