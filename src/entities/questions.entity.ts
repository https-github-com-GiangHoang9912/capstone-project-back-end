import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { AnswerGroup } from './answer-groups.entity';
import { Exam } from './exams.entity';
import { QuestionBank } from './question-bank.entity';

@Entity('questions')
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'question_bank_id' })
  questionBankId: number;

  @Column({ name: 'exam_id' })
  examId: number;

  // relationship with exam
  @ManyToOne(() => Exam, (exam) => exam.question, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'exam_id', referencedColumnName: 'id' })
  exam: Exam;

  // relationship with answers_groups
  @OneToMany(() => AnswerGroup, (answerGroup) => answerGroup.question, {})
  answerGroup: AnswerGroup;

  // relationship with question_bank
  @ManyToOne(() => QuestionBank, (questionBank) => questionBank.question, {})
  @JoinColumn({ name: 'question_bank_id', referencedColumnName: 'id' })
  questionBank: QuestionBank;
}
