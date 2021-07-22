import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn
} from 'typeorm';
import { Exam } from './exams.entity';

@Entity('subject')
export class Subject extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({name: "subject_name"})
  subjectName: string;

  @OneToMany(() => Exam, (exam) => exam.subject, {
    onDelete: 'CASCADE',
  })
  exam: Subject;
}