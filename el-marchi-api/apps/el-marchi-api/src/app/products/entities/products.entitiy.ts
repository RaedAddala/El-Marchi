import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SubCategory } from '../../categories/entities/subCategory.entity';
import { BaseEntity } from '../../common/database/base.entity';
@Entity()
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  brand!: string;

  @Column({ type: 'varchar', length: 7 }) // Hex color code
  color!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'varchar', length: 50 })
  size!: string;

  @Column({ type: 'boolean', default: false })
  featured!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  pictures!: { publicId: string; mimeType: string }[];

  @Column({ type: 'int' })
  nbInStock!: number;

  @ManyToOne(() => SubCategory, subCategory => subCategory.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sub_category_id' })
  subCategory!: SubCategory;
}
