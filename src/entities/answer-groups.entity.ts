import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Answer } from './answers.entity';
import { Question } from './questions.entity';

@Entity('answers_groups')
export class AnswerGroup extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'questions_id' })
  questionId: number;

  @Column({ name: 'answer_id' })
  answerId: number;

  @Column({ name: 'correct' })
  correct: boolean;

  // relationship with questions
  @ManyToOne(() => Question, (question) => question.answerGroup, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questions_id', referencedColumnName: 'id' })
  question: Question;

  // relationship with answers
  @ManyToOne(() => Answer, (answer) => answer.answerGroup, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'answer_id', referencedColumnName: 'id' })
  answer: Answer;
}
