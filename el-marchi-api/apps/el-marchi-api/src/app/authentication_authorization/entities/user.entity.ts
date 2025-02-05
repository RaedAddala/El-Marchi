import { Column, Entity, Index, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { Trader } from '../../traders/entities/trader.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({
    nullable: false,
    length: 40,
    type: 'varchar',
  })
  firstName!: string;

  @Column({
    nullable: false,
    length: 40,
    type: 'varchar',
  })
  lastName!: string;

  @Column({
    nullable: false,
    length: 150,
    type: 'varchar',
    unique: true,
  })
  @Index('IDX_user_email')
  email!: string;

  @Column({
    nullable: false,
    name: 'phone_number',
    type: 'varchar',
    length: 20,
  })
  phoneNumber!: string;

  @Column({
    nullable: false,
    type: 'date',
  })
  birthDate!: Date;

  @Column({
    nullable: false,
    select: false,
  })
  passwordHash!: string;

  @Column({
    nullable: false,
    select: false,
  })
  passwordSalt!: string;

  @OneToOne(() => Customer, customer => customer.user, { nullable: true })
  customer?: Customer;

  @OneToOne(() => Trader, trader => trader.user, { nullable: true })
  trader?: Trader;
}
