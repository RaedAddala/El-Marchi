import {Entity, Column, OneToMany} from "typeorm";
import {SubCategory} from "./subCategory.entity";
import {BaseEntity} from "../../common/database/base.entity";

@Entity()
export class Category extends BaseEntity {
  @Column({
    nullable: false,
    length: 100,
    type: 'varchar',
    unique: true,
  })
  name!: string;

  @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
  subCategories!: SubCategory[];
}
