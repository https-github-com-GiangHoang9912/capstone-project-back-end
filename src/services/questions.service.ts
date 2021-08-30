import { Exam } from '../entities/exams.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entities/questions.entity';
import { AnswerGroup } from '../entities/answer-groups.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(AnswerGroup)
    private readonly answerGroupRepository: Repository<AnswerGroup>,
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
  ) {}

  async getQuestion(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  async getQuestionsByExamId(exam_id: number): Promise<any> {
    const answerGroup = await this.examRepository
      .createQueryBuilder('exams')
      .leftJoinAndSelect('exams.subject', 'subject')
      .leftJoinAndSelect('exams.question', 'question')
      .leftJoinAndSelect('question.questionBank', 'questionBank')
      .leftJoinAndSelect('question.answerGroup', 'answerGroup')
      .leftJoinAndSelect('answerGroup.answer', 'answer')
      .where('question.exam_id = :exam_id', { exam_id: exam_id })
      .getMany();
    return answerGroup;
  }

  async getQuestionDetail(questionId: number): Promise<any> {
    const question = await this.questionRepository.findOne({ id: questionId });
    return question;
  }

  async createQuestion(question: any, exam: any): Promise<any> {
    const ques = await this.questionRepository
      .create({
        questionBank: question,
        exam: exam,
      })
      .save();
    return ques;
  }

  async createNewQuestion(
    questionBankId: number,
    examId: number,
  ): Promise<any> {
    const ques = await this.questionRepository
      .create({
        questionBankId: questionBankId,
        examId: examId,
      })
      .save();
    return ques;
  }

  async createAnswerGroup(): Promise<any> {
    const answerGroup = await this.answerGroupRepository.create().save();
    return answerGroup;
  }

  async deleteQuestion(id: number): Promise<any> {
    const result = await this.questionRepository
      .createQueryBuilder()
      .delete()
      .from(Question)
      .where('id = :id', { id: id })
      .execute();
    return { deleted: result.affected };
  }

  async updateQuestion(
    questionId: number,
    answerGroupId: number,
  ): Promise<any> {
    const question = await this.questionRepository
      .createQueryBuilder()
      .update(Question)
      .where('id = :id', { id: questionId })
      .execute();
    return question;
  }
}
