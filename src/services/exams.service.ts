import { QuestionBank } from 'src/entities/question-bank.entity';
import { Exam } from '../entities/exams.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from 'src/entities/subjects.entity';
import { Question } from 'src/entities/questions.entity';
import { AnswerGroup } from 'src/entities/answer-groups.entity';
@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
  ) {}

  async getExam(): Promise<Exam[]> {
    return this.examRepository.find();
  }

  async getExamByUser(user_id: number): Promise<any> {
    const exams = await this.examRepository
      .createQueryBuilder('exam')
      .where('user_id = :user_id', { user_id: user_id })
      .getMany();
    // console.log(exams);
    return exams;
  }

  async getExamAndSubjectByUser(user_id: number): Promise<any> {
    console.log(user_id);
    const exams = await this.examRepository
      .createQueryBuilder('exams')
      .where('user_id = :user_id', { user_id: user_id })
      .leftJoinAndSelect('exams.subject', 'Subject')
      .getMany();
    // console.log('examss alalalla: ', exams);
    return exams;
  }

  async searchExamByName(examName: string): Promise<Exam[]> {
    return this.examRepository
      .createQueryBuilder('exam')
      .where('exam.exam_name like :exam_name', { exam_name: `%${examName}%` })
      .leftJoinAndSelect('exam.subject', 'Subject')
      .getMany();
  }

  async deleteExam(id: number) {
    const result = await this.examRepository
      .createQueryBuilder()
      .delete()
      .from(Exam)
      .where('id = :id', { id: id })
      .execute();
    return { deleted: result.affected };
  }

  async createExam(subjectId: number, examName: string, userId: number) {
    const exam = await this.examRepository
      .create({
        examName,
        userId,
        subjectId,
      })
      .save();

    return exam;
  }
}
