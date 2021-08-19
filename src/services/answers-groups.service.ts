import { AnswerGroup } from '../entities/answer-groups.entity';
import { Answer } from '../entities/answers.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AnswerGroupService {
  constructor(
    @InjectRepository(AnswerGroup)
    private readonly answerGroupRepository: Repository<AnswerGroup>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async getAnswersGroups(): Promise<AnswerGroup[]> {
    return this.answerGroupRepository.find();
  }

  async getAnswersGroupsById(id: number): Promise<any> {
    try {
      const answerGroup = await this.answerGroupRepository
        .createQueryBuilder('answers_groups')
        .leftJoinAndSelect('answers_groups.answer', 'Answer')
        .where('answers_groups.id = :id', { id: id })
        .getOne();
      return answerGroup;
    } catch (error) {
      console.log('Fail to get answer group by id', error);
    }
  }

  async deleteAnswerGroup(questionId: number): Promise<any> {
    const result = await this.answerGroupRepository.find({
      questionId: questionId,
    });
    result.forEach(async (item: any) => {
      await this.answerGroupRepository.delete(item);
    });
    return result;
  }

  async updateAnswerGroupTrueFalse(
    idAnswerGroup: number,
    correct: boolean,
  ): Promise<AnswerGroup> {
    try {
      const answerGroup = await this.answerGroupRepository.findOne({
        id: idAnswerGroup,
      });
      console.log('kaakkaakaka', correct);
      answerGroup.correct = correct;
      console.log('answerGroup', answerGroup);
      answerGroup.save();
      return answerGroup;
    } catch (err) {
      console.log('Fail update answerGroup', err);
    }
  }

  async createAnswerGroup(
    questionId: number,
    answerId: number,
    correct: boolean,
  ): Promise<AnswerGroup> {
    try {
      const answerGroup = await this.answerGroupRepository
        .create({
          questionId: questionId,
          answerId: answerId,
          correct: correct,
        })
        .save();
      return answerGroup;
    } catch (err) {
      console.log('Fail create answerGroup', err);
    }
  }

  async createAnswerGroupMultiple(
    questionId: number,
    correct: boolean,
    answerText: string,
  ): Promise<any> {
    try {
      // console.log(questionId, '-', correct, ':', answerText);
      const answer = await this.answerRepository
        .create({
          answerText: answerText,
        })
        .save();
      const answerGroup = await this.answerGroupRepository
        .create({
          questionId: questionId,
          answerId: answer.id,
          correct: correct,
        })
        .save();
      console.log('answerGroup', answerGroup);
      return answerGroup;
    } catch (err) {
      console.log('Fail update answerGroup', err);
    }
  }
}
