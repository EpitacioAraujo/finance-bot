import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('order_items')
export class OrderItemSchema {
  @PrimaryColumn('varchar', { length: 26 })
  id: string;

  @Column('uuid')
  orderId: string;

  @Column('uuid')
  productId: string;

  @Column('integer')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;
}
