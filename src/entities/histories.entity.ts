import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn
} from 'typeorm';
import { HistoryType } from './history-types.entity';

@Entity('histories')
export class History extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'users_id' })
  userId: number;

  @Column({ name: 'type_id' })
  typeId: number;

  @Column({ name: 'date' })
  date: Date;

  @ManyToOne(() => HistoryType, (historyType) => historyType.history, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'type_id', referencedColumnName: 'id' })
  historyType: HistoryType;
}
