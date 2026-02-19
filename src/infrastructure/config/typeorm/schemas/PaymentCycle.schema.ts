import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PaymentTypeSchema } from './PaymentType.schema';

@Entity('payment_cycles')
export class PaymentCycleSchema {
  @PrimaryColumn('varchar', { length: 26 })
  id: string;

  @Column('timestamp')
  start_date: Date;

  @Column('timestamp')
  end_date: Date;

  @Column('varchar', { length: 26, name: 'payment_type_id' })
  paymentTypeId: string;

  @ManyToOne(() => PaymentTypeSchema)
  @JoinColumn({ name: 'payment_type_id' })
  paymentType: PaymentTypeSchema;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
