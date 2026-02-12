import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('orders')
export class OrderSchema {
  @PrimaryColumn('varchar', { length: 26 })
  id: string;

  @Column('varchar', { length: 50 })
  orderNumber: string;

  @Column('uuid')
  customerId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column('varchar', { length: 255, nullable: true })
  deliveryAddress: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column('varchar', { length: 500, nullable: true })
  paymentLink: string;

  @Column('enum', {
    enum: [
      'PENDING_APPROVAL',
      'APPROVED',
      'PAYMENT_PENDING',
      'PAID',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
    ],
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
