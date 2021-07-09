import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn
} from 'typeorm';
import { History } from './history.entity';

@Entity('history_types')
export class HistoryType extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({name: "history_name"})
  historyName: string;

  @OneToMany(() => History, (history) => history.historyType, {
    onDelete: 'CASCADE',
  })
  history: History;
}
