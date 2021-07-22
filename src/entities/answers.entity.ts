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
  id: number;

  @Column()
  answerText: string;

  @Column({name: "answer_group_id"})
  answerGroupId: number;

  @ManyToOne(() => AnswerGroup, (answerGroup) => answerGroup.answer, {
  })
  @JoinColumn({ name: 'answer_group_id', referencedColumnName: 'id' })
  answerGroup: AnswerGroup;


}