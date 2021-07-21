import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';
import { ContactInfo } from './contactInfo.entity';
import { Exam } from './exam.entity'
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

  @Column({ nullable: true, name: 'refreshtoken' })
  refreshToken: string;

  @Column({ type: 'datetime', nullable: true, name: 'refreshtokenexp' })
  refreshTokenExp: Date;

  @OneToOne(() => ContactInfo, (contactInfo) => contactInfo.user, {
    onDelete: 'CASCADE',
  })
  contactInfo: ContactInfo;
  @OneToMany(() => Exam, (exam) => exam.user, {
    onDelete: 'CASCADE',
  })
  exam: Exam;
}
