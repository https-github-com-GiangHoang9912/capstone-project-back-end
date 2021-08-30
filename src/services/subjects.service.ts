import { Subject } from '../entities/subjects.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async getSubject(): Promise<Subject[]> {
    return this.subjectRepository.find();
  }

  async getSubjectById(subjectId: number): Promise<Subject> {
    return this.subjectRepository.findOne({ id: subjectId });
  }

  async createSubject(subjectName): Promise<any> {
    const subject = await this.subjectRepository
      .create({
        subjectName: subjectName,
      })
      .save();
    return subject;
  }

  async getQuestionBankBySubjectId(subject_id: number): Promise<any> {
    const subject = await this.subjectRepository
      .createQueryBuilder('subjects')
      .where('subjects.id = :id', { id: subject_id })
      .leftJoinAndSelect('subjects.questionBank', 'QuestionBank')
      .getMany();
    return subject;
  }
}
