import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn
} from 'typeorm';
import { Subject } from './subject.entity';

@Entity('Exam')
export class Exam extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({name: "exam_name"})
  examName: string;

  @ManyToOne(() => Subject, (subject) => subject.exam, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subject_id', referencedColumnName: 'id' })
  subject: Subject;
}