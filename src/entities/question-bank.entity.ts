import { Subject } from '../entities/subjects.entity';
import { Question } from '../entities/questions.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('question_bank')
export class QuestionBank extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'question_text' })
  questionText: string;

  @Column({ name: 'subject_id' })
  subjectId: number;

  @OneToMany(() => Question, (question) => question.questionBank, {
    onDelete: 'CASCADE',
  })
  question: Question;

  @ManyToOne(() => Subject, (subject) => subject.questionBank, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subject_id', referencedColumnName: 'id' })
  subject: Subject;
}
