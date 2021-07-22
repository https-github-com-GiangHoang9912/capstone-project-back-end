import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Question } from './question.entity';
import { Subject } from './subjects.entity';
import { User } from './users.entity';
@Entity('exam')
export class Exam extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: "exam_name" })
  examName: string;
  @Column({ name: "subject_id" })
  subjectId: number;
  @Column({ name: "user_id" })
  userId: number;
  @ManyToOne(() => Subject, (subject) => subject.exam, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subject_id', referencedColumnName: 'id' })
  subject: Subject;

  @ManyToOne(() => User, (user) => user.exam, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => Question, (question) => question.exam, {
  })
  question: Question;

}
