import { User } from "@app/Domain/Entities/User";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
  name: "users",
})
export class UserEntity implements User {
  @PrimaryColumn({ type: "varchar", length: 52 })
  public id!: string;

  @Column({ type: "varchar", length: 255 })
  public username!: string;

  @Column({
    name: "number_phone",
    type: "varchar",
    length: 32,
  })
  public numberPhone!: string;
}
