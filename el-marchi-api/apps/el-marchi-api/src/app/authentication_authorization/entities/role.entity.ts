import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientRole } from '../../common/enums/roles.enum';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ unique: true, nullable: false })
  name!: ClientRole;

  @Column({ type: 'integer', default: 999, nullable: false })
  rank!: number;

  @ManyToMany(() => User, user => user.roles)
  users?: User[];

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions?: Permission[];
}
