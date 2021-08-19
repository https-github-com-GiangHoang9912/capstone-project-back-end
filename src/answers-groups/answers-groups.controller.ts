import { AnswerGroup } from '../entities/answer-groups.entity';
import { AnswerGroupDto } from './../dto/answer-group.dto';
import { AnswerGroupService } from '../services/answers-groups.service';
import {
  Body,
  Res,
  Controller,
  HttpStatus,
  UseGuards,
  Param,
  Get,
  Put,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface DataQuestion {
  currentQuestionAnswerGroup: AnswerGroupDto[];
  valueTypeAnswer: string;
}

@UseGuards(JwtAuthGuard)
@Controller('answers-groups')
export class AnswerGroupController {
  constructor(private readonly answerGroupService: AnswerGroupService) {}

  @Get('/')
  async getAnswersGroups(@Res() res: Response): Promise<any> {
    try {
      const data = await this.answerGroupService.getAnswersGroups();
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {}
  }

  @Get('/:id')
  async getAnswersGroupsById(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<any> {
    try {
      const data = await this.answerGroupService.getAnswersGroupsById(id);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {}
  }

  @Post('/create/:id')
  async createAnswerGroup(
    @Res() res: Response,
    @Param() idQuestion: number,
    @Body() dataQuestion: DataQuestion,
  ): Promise<any> {
    try {
      await this.answerGroupService.deleteAnswerGroup(idQuestion);
      let data = null;
      dataQuestion.currentQuestionAnswerGroup.forEach(async (item: any) => {
        if (dataQuestion.valueTypeAnswer == 'tf') {
          data = await this.answerGroupService.createAnswerGroup(
            idQuestion,
            item.answerId,
            item.correct,
          );
        } else {
          data = await this.answerGroupService.createAnswerGroupMultiple(
            idQuestion,
            item.correct,
            item.answer.answerText,
          );
        }
      });
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {}
  }

  @Put('/update/multiple/:id')
  async updateAnswerGroupMultiple(
    @Res() res: Response,
    @Param() idQuestion: number,
    @Body() dataAnswerGroup: AnswerGroupDto[],
  ): Promise<any> {
    try {
      dataAnswerGroup.forEach(async (item: AnswerGroup) => {
        if (item.questionId) {
          const data = await this.answerGroupService.updateAnswerGroupTrueFalse(
            item.id,
            item.correct,
          );
        } else {
          const data = await this.answerGroupService.createAnswerGroupMultiple(
            idQuestion,
            item.correct,
            item.answer.answerText,
          );
        }
      });
      return res.status(HttpStatus.OK).send(dataAnswerGroup);
    } catch (error) {}
  }

  @Put('/update')
  async updateAnswerGroupTrueFalse(
    @Res() res: Response,
    @Body() dataAnswerGroup: AnswerGroupDto[],
  ): Promise<any> {
    try {
      dataAnswerGroup.map(async (item: AnswerGroup) => {
        const data = await this.answerGroupService.updateAnswerGroupTrueFalse(
          item.id,
          item.correct,
        );
        return data;
      });
      return res.status(HttpStatus.OK).send(dataAnswerGroup);
    } catch (error) {}
  }
}
