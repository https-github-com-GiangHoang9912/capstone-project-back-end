import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { AnswerGroup } from './answer-groups.entity';

@Entity('answers')
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  answerId: number;

  @Column({name: "answerText"})
  answerText: string;

  // relationship with answers_groups
  @OneToMany(() => AnswerGroup, (answerGroup) => answerGroup.answer, {
  })
  answerGroup: AnswerGroup;
}
