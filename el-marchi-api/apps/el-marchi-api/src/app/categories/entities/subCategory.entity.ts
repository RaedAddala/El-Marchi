import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';
import { Product } from '../../products/entities/products.entitiy';
import { Category } from './category.entity';
@Entity()
export class SubCategory extends BaseEntity {
  @Column({
    nullable: false,
    length: 100,
    type: 'varchar',
  })
  name!: string;

  @ManyToOne(() => Category, category => category.subCategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @OneToMany(() => Product, product => product.subCategory)
  products!: Product[];
}
