import { Exam } from '../entities/exams.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
  ) {}

  async getExam(): Promise<Exam[]> {
    return this.examRepository.find();
  }
  async getExamByUser(
    user_id: number,
  ): Promise<any> {
    const exams = await this.examRepository
      .createQueryBuilder('exam')
      .where('user_id = :user_id', { user_id: user_id })
      .getMany();
    return exams;
  }
}
