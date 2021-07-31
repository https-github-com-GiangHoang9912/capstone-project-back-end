import { QuestionBank } from './question-bank.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn
} from 'typeorm';
import { Exam } from './exams.entity';

@Entity('subjects')
export class Subject extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({name: "subject_name"})
  subjectName: string;

  @OneToMany(() => Exam, (exam) => exam.subject, {
  })
  exam: Exam;

  @OneToMany(() => QuestionBank, (questionBank) => questionBank.subject, {
  })
  questionBank: QuestionBank;
}