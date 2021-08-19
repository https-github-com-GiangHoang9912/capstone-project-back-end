import { Subject } from '../entities/subjects.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionBank } from '../entities/question-bank.entity';

@Injectable()
export class QuestionBankService {
  constructor(
    @InjectRepository(QuestionBank)
    private readonly questionBankRepository: Repository<QuestionBank>,
  ) {}

  async getQuestionBankBySubjectId(subjectId: number): Promise<QuestionBank[]> {
    const questions = await this.questionBankRepository
      .createQueryBuilder('question_bank')
      .where('subject_id = :subjectId', { subjectId: subjectId })
      .getMany();
    return questions;
  }

  async addQuestionNoDuplicateToBank(
    subjectId: number,
    questionText: string,
  ): Promise<QuestionBank> {
    const questions = await this.questionBankRepository
      .create({
        questionText: questionText,
        subjectId: subjectId,
      })
      .save();

    return questions;
  }
}
