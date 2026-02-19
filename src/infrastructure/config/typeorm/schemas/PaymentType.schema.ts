import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_types')
export class PaymentTypeSchema {
  @PrimaryColumn('varchar', { length: 26 })
  id: string;

  @Column('varchar', { length: 255 })
  name: string;
  
  @Column('varchar', { length: 10 })
  cycle_type: 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  
  @Column('int')
  cycle_day_start: number;
  
  @Column('int')
  cycle_day_end: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
