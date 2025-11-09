import { User } from "@app/Domain/Entities/User";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
  name: "users",
})
export class UserEntity implements User {
  @PrimaryColumn()
  public id!: string;

  @Column()
  public username!: string;

  @Column({
    name: "number_phone",
  })
  public numberPhone!: string;
}
