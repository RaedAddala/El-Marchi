import {Column, Entity, ManyToOne, OneToMany} from 'typeorm';
import {Category} from "./category.entity";
import {BaseEntity} from "../../common/database/base.entity";
import {Product} from "../../products/entities/products.entitiy";
@Entity()
export class SubCategory extends BaseEntity {
  @Column({
    nullable: false,
    length: 100,
    type: 'varchar',
  })
  name!: string;

  @ManyToOne(() => Category, (category) => category.subCategories, {
    onDelete: 'CASCADE',
  })
  category!: Category;

  //products: Product[];
  @OneToMany(() => Product, (product) => product.subCategory)
  products!: Product[]
}
