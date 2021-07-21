import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { AnswerGroup } from './answer-group.entity';
import { Exam } from './exam.entity';

@Entity('question')
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: "question_text" })
  questionText: string;

  @Column({ name: "answer_group_id" })
  answerGroupId: number;

  @Column({ name: "exam_id" })
  examId: number;

  @ManyToOne(() => Exam, (exam) => exam.question, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'exam_id', referencedColumnName: 'id' })
  exam: Exam

  @ManyToOne(() => AnswerGroup, (answerGroup) => answerGroup.question, {
  })
  @JoinColumn({ name: 'answer_group_id', referencedColumnName: 'id' })
  answerGroup: AnswerGroup;


}