import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserSchema } from './User.schema';

@Entity('sessions')
export class SessionSchema {
  @PrimaryColumn('varchar', { length: 26 })
  id: string;

  @Column('varchar', { length: 26 })
  userId: string;

  @ManyToOne(() => UserSchema, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: UserSchema;

  @Column('varchar', { length: 45, nullable: true })
  ipAddress?: string;

  @Column('text', { nullable: true })
  userAgent?: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp')
  expiresAt: Date;

  @Column('timestamp', { nullable: true })
  revokedAt?: Date;
}
