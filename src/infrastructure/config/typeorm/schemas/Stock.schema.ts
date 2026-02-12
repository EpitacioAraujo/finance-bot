import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('stocks')
export class StockSchema {
  @PrimaryColumn('varchar', { length: 26 })
  id: string;

  @Column('uuid')
  productId: string;

  @Column('integer')
  totalQuantity: number;

  @Column('integer')
  reservedQuantity: number;

  @Column('integer')
  availableQuantity: number;

  @Column('integer')
  committedQuantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
