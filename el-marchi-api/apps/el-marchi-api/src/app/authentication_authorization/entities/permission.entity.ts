import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ClientPermission } from '../../common/enums/permission.enum';

@Entity('permissions')
export class Permission {

  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ unique: true, nullable: false })
  name!: ClientPermission;

}
