import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reservations')
export class ReservationSchema {
  @PrimaryColumn('varchar', { length: 26 })
  id: string;

  @Column('uuid')
  customerId: string;

  @Column('uuid')
  productId: string;

  @Column('integer')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('enum', { enum: ['ACTIVE', 'CONVERTED', 'EXPIRED', 'CANCELLED'] })
  status: string;

  @Column('timestamp')
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
