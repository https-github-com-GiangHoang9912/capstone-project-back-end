import { Exam } from './../entities/exams.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from 'src/entities/subjects.entity';
import { Question } from 'src/entities/questions.entity';
import { AnswerGroup } from 'src/entities/answer-groups.entity';
@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

  ) { };

  async getQuestion(): Promise<Question[]> {
    return this.questionRepository.find();
  };

  async getQuestionDetail(
    exam_id: number,
  ): Promise<any> {
    console.log(exam_id);
    const question = await this.questionRepository
      .createQueryBuilder('question')
      .where('question.exam_Id = :exam_id', { exam_id: exam_id })
      .leftJoinAndSelect('question.answerGroup', 'AnswerGroup')
      .leftJoinAndSelect('AnswerGroup.answer', 'Answer')
      .getMany();
    console.log('Question alalalla: ', question);
    return question;
  };


}
