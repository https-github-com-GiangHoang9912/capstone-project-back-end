import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { ContactInfo } from './contactInfo.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: number;

  @OneToOne(() => ContactInfo, (contactInfo) => contactInfo.user, {
    onDelete: 'CASCADE',
  })
  contactInfo: ContactInfo;
}
