import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity('contacts')
export class ContactInfo extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

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
  avatar?: string;

  @Column()
  ownerId: number;

  @OneToOne(() => User, (user) => user.contactInfo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId', referencedColumnName: 'id' })
  user: User;
}
