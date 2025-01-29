import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/database/base.entity';
import { User } from './user.entity';

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @Column({ nullable: false })
  token!: string;

  @ManyToOne(() => User, undefined, { nullable: false, eager: true })
  user!: User;

  @Column({
    nullable: false,
    type: 'date',
  })
  expiryDate!: Date;

}
