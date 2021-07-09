import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    BaseEntity,
  } from 'typeorm';
  import { HistoryType } from './history-type.entity';
  
  @Entity('history')
  export class History extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;
  
    @ManyToOne(() => HistoryType, (historyType) => historyType.history, {
      onDelete: 'CASCADE',
    })
    historyType: HistoryType;
  }
  