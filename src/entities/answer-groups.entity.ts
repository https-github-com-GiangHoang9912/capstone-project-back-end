import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn
} from 'typeorm';
import { Answer } from './answers.entity';
import { Question } from './questions.entity';

@Entity('answer_groups')
export class AnswerGroup extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({name: "correct_answer"})
  correctAnswer: number;

  @OneToMany(() => Question, (question) => question.answerGroup, {

  })
  question: Question;

  @OneToMany(() => Answer, (answer) => answer.answerGroup, {
  })
  answer: Answer
}
