import { Exam } from '../entities/exams.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from 'src/entities/subjects.entity';
import { Question } from 'src/entities/questions.entity';
import { AnswerGroup } from 'src/entities/answer-groups.entity';
import { QuestionBank } from 'src/entities/question-bank.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(AnswerGroup)
    private readonly answerGroupRepository: Repository<AnswerGroup>,
  ) { }

  async getQuestion(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  async getQuestionDetail(exam_id: number): Promise<any> {
    // console.log(exam_id);
    const question = await this.questionRepository
      .createQueryBuilder('questions')
      .where('questions.exam_id = :exam_id', { exam_id: exam_id })
      .leftJoinAndSelect('questions.questionBank', 'QuestionBank')
      .leftJoinAndSelect('questions.answerGroup', 'AnswerGroup')
      .leftJoinAndSelect('AnswerGroup.answer', 'Answer')
      .getMany();
    // console.log('Question alalalla: ', question);
    return question;
  }

  async createQuestion(question: any, exam: any): Promise<any> {
    const ques = await this.questionRepository
      .create({
        questionBank: question,
        exam: exam,
        answerGroupId: 1
      })
      .save();
    return ques;
  }

  async createNewQuestion(questionBankId: number, examId: number): Promise<any> {
    const answerGroup = await this.answerGroupRepository
      .create()
      .save();
    const ques = await this.questionRepository
      .create({
        questionBankId: questionBankId,
        examId: examId,
        answerGroupId: answerGroup.id
      })
      .save();
    return ques;
  }

  async createAnswerGroup(): Promise<any> {
    const answerGroup = await this.answerGroupRepository
      .create()
      .save();
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


  async updateQuestion(questionId: number, answerGroupId: number): Promise<any> {
    const question = await this.questionRepository
      .createQueryBuilder()
      .update(Question)
      .set({ answerGroupId: answerGroupId })
      .where("id = :id", { id: questionId })
      .execute();
    return question;
  }

}
