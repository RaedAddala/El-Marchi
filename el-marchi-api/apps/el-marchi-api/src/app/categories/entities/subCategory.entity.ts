import { Column, Entity, ManyToOne} from 'typeorm';
import {Category} from "./category.entity";
import {BaseEntity} from "../../common/database/base.entity";
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
}
