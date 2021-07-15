import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn
} from 'typeorm';
import { Subject } from './subject.entity';
import {User} from './user.entity'
@Entity('exam')
export class Exam extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({name: "exam_name"})
  examName: string;
  @Column({name: "subject_id"})
  subjectId: number;
  @Column({name: "user_id"})
  userId: number;
  @ManyToOne(() => Subject, (subject) => subject.exam, {
    onDelete: 'CASCADE',
  })
  @ManyToOne(() => User, (user) => user.exam, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subject_id', referencedColumnName: 'id' })
  subject: Subject;
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}