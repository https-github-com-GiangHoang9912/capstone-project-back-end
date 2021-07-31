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

  async getQuestionBankBySubjectId(subject_id: number): Promise<any> {
    console.log(subject_id);
    const subject = await this.subjectRepository
      .createQueryBuilder('subjects')
      .where('subjects.id = :id', { id: subject_id })
      .leftJoinAndSelect('subjects.questionBank', 'QuestionBank')
      .getMany();
    console.log('Subject detail: ', subject);
    return subject;
  }
}
