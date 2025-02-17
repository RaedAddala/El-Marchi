import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';
import { SubCategory } from './subCategory.entity';

@Entity()
export class Category extends BaseEntity {
  @Column({
    nullable: false,
    length: 100,
    type: 'varchar',
    unique: true,
  })
  name!: string;

  @OneToMany(() => SubCategory, subCategory => subCategory.category)
  subCategories!: SubCategory[];
}
