  import {
  Column,
  Entity,
  OneToOne,
  ObjectIdColumn,
  ObjectID,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { User } from './user.entity'

@Entity('contact')
export class ContactInfo extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  firstName: string;

  @Column()
  lastName?: string;

  @Column()
  email: string;

  @Column()
  phone?: string;

  @Column()
  dateOfBirth?: Date;

  @Column()
  address?: string;

  @Column()
  ownerId: object;

  @OneToOne(() => User, user => user.contactInfo, {onDelete:'CASCADE'})
  @JoinColumn({name : "ownerId", referencedColumnName: "_id"})
  user: User;
}
