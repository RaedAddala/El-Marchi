
import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({
    nullable: false,
    length: 40,
    type: 'varchar'
  })
  firstName!: string;

  @Column({
    nullable: false,
    length: 40,
    type: 'varchar'
  })
  lastName!: string;

  @Column({
    nullable: false,
    length: 150,
    type: 'varchar',
    unique: true
  })
  @Index('IDX_user_email')
  email!: string;

  @Column({
    nullable: false,
    type: 'date'
  })
  birthDate!: Date;

  @Column({
    nullable: false,
    length: 255,
    type: 'varchar',
    select: false
  })
  passwordHash!: string;

  @Column({
    nullable: false,
    length: 255,
    type: 'varchar',
    select: false
  })
  passwordSalt!: string;

}
