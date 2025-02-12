import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

Entity('products');
export class Product extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: false })
  description!: string;

  @Column({ type: 'text', nullable: true })
  tags?: string;

  @Column({ name: 'unit_price', type: 'numeric', nullable: false })
  unitPrice!: number;

  @Column({ type: 'varchar', nullable: true })
  image?: string;
}
