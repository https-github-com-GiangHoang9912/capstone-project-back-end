import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    BaseEntity,
  } from 'typeorm';
  import { History } from './history.entity'
  
  @Entity('history_types')
  export class HistoryType extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    typeID: number;
  
    

    @OneToMany(() => History, (history) => history.historyType, {
      onDelete: 'CASCADE',
    })
    history: History;
  }
  