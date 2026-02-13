import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class TransactionSchema {
  @PrimaryColumn('varchar', { length: 26 })
  id: string;

  @Column('numeric', { precision: 14, scale: 2 })
  amount: number;

  @Column('varchar', { length: 10 })
  type: 'income' | 'outcome';

  @Column('text')
  description: string;

  @Column('timestamp')
  executionDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
