import {
  Column,
  Entity,
  OneToOne,
  ObjectIdColumn,
  ObjectID,
  PrimaryGeneratedColumn,
  BaseEntity,
  Generated,
} from 'typeorm';
import { ContactInfo } from './contactInfo.entity';

@Entity()
export class User extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column({ unique: true })
  userName: string;

  @Column()
  passwordEncryption: string;

  @Column()
  role: number;

  @OneToOne(() => ContactInfo, (contactInfo) => contactInfo.user, {
    onDelete: 'CASCADE',
  })
  contactInfo: ContactInfo;
}
