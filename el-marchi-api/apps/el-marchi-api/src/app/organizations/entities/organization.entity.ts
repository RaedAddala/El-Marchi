import { Column, Entity, OneToMany } from 'typeorm';
import { User } from '../../authentication_authorization/entities/user.entity';
import { BaseEntity } from '../../common/database/base.entity';

@Entity('organizations')
export class Organization extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name!: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  official_email!: string;

  @OneToMany(() => User, user => user.organization)
  employees!: User[];
}
