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
import { ExtendedColumnOptions } from 'typeorm-encrypted';

@Entity('question_bank')
export class QuestionBank extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column(<ExtendedColumnOptions>{
    name: 'question_text',
    encrypt: {
      key: 'e41c966f21f9e1577802463f8924e6a3fe3e9751f201304213b2f845d8841d61',
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: 'ff5ac19190424b1d88f9419ef949ae56',
    },
  })
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
