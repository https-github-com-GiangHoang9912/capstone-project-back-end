import { Exam } from './../entities/exam.entity';
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
  async getExambyUser(
    user_id: number,
  ): Promise<any> {
    console.log(user_id);
    const exams = await this.examRepository
      .createQueryBuilder('exam')
      .where('user_id = :user_id', { user_id: user_id })
      .getMany();
      console.log(exams);
    return exams;
  }
}
