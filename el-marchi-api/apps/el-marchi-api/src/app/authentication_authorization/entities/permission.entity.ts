import { MongoQuery } from '@casl/ability';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Action } from '../../common/guards/casl.enum';
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({
    type: 'enum',
    enum: Action,
    default: Action.Read,
  })
  action!: Action;

  @Column({ type: 'varchar', length: 255 })
  subject!: string;

  @Column({ default: false })
  inverted!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  conditions?: MongoQuery;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @ManyToMany(() => Role, role => role.permissions)
  roles?: Role[];

  @ManyToMany(() => User, user => user.permissions)
  users?: User[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: 'now()',
    readonly: true,
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: 'now()',
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt?: Date;
}
