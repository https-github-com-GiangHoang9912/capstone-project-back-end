import { HistoryType } from '../entities/history-types.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class HistoryTypeService {
  constructor(
    @InjectRepository(HistoryType)
    private readonly historyTypeRepository: Repository<HistoryType>,
  ) {}

  async getHistoryTypes(): Promise<HistoryType[]> {
    return this.historyTypeRepository.find();
  }
}
