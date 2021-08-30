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

  async getExamByUser(user_id: number): Promise<any> {
    const exams = await this.examRepository
      .createQueryBuilder('exams')
      .where('user_id = :user_id', { user_id: user_id })
      .getMany();
    return exams;
  }

  async getExamAndSubjectByUser(user_id: number): Promise<any> {
    const exams = await this.examRepository
      .createQueryBuilder('exams')
      .where('user_id = :user_id', { user_id: user_id })
      .leftJoinAndSelect('exams.subject', 'Subjects')
      .getMany();
    return exams;
  }

  async searchExamByName(user_id: number, examName: string): Promise<Exam[]> {
    return this.examRepository
      .createQueryBuilder('exams')
      .where('user_id = :user_id', { user_id: user_id })
      .andWhere('exams.exam_name like :exam_name', {
        exam_name: `%${examName}%`,
      })
      .leftJoinAndSelect('exams.subject', 'Subjects')
      .getMany();
  }

  async deleteExam(id: number) {
    try {
      const result = await this.examRepository.findOne({ id: id });
      const dataDelete = await this.examRepository.remove(result);
      return {"raw": dataDelete};
    } catch (err) {
    }
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
