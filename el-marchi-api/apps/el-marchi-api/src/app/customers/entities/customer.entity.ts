import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../authentication_authorization/entities/user.entity';
import { BaseEntity } from '../../common/database/base.entity';

@Entity('customers')
export class Customer extends BaseEntity {
  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'user_id', nullable: false })
  userId!: string;
}
