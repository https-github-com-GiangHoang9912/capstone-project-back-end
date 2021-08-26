import { History } from '../entities/histories.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  async createHistory(
    historyType: number,
    description: string,
    userId: number,
  ) {
    const history = await this.historyRepository
      .create({
        typeId: historyType,
        description,
        userId,
        date: moment().format('YYYY/MM/DD HH:mm:ss'),
      })
      .save();
    return history;
  }

  async getHistoryByUserAndType(
    users_id: string,
    type_id: string,
  ): Promise<History[]> {
    if (type_id === 'all') {
      const histories = await this.historyRepository
      .createQueryBuilder('history')
      .where('users_id = :users_id', { users_id: users_id })
      .getMany();
      return histories;
    }else{
    const histories = await this.historyRepository
      .createQueryBuilder('history')
      .where('users_id = :users_id', { users_id: users_id })
      .andWhere('type_id = :type_id', { type_id: type_id })
      .getMany();
      return histories;
    }
  }
}
