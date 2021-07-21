import { Exam } from './../entities/exam.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from 'src/entities/subject.entity';
import { Question } from 'src/entities/question.entity';
import { AnswerGroup } from 'src/entities/answer-group.entity';
@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,

  ) { };

  async getExam(): Promise<Exam[]> {
    return this.examRepository.find();
  };

  async getExambyUser(
    user_id: number,
  ): Promise<any> {
    console.log(user_id);
    const exams = await this.examRepository
      .createQueryBuilder('exam')
      .where('user_id = :user_id', { user_id: user_id })
      .getMany();
    // console.log(exams);
    return exams;
  };

  async getExamAndSubjectbyUser(
    user_id: number,
  ): Promise<any> {
    console.log(user_id);
    const exams = await this.examRepository
      .createQueryBuilder('exam')
      .where('user_id = :user_id', { user_id: user_id })
      .leftJoinAndSelect('exam.subject', 'Subject')
      .getMany();
    // console.log('examss alalalla: ', exams);
    return exams;
  };


  async deleteExam(id: number) {
    const result = await this.examRepository
      .createQueryBuilder()
      .delete()
      .from(Exam)
      .where("id = :id", { id: id })
      .execute()
    return { deleted: result.affected };
  };
}
