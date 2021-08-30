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
import { HistoryService } from '../services/histories.service';
import * as CONSTANTS from '../constant';
interface DataQuestion {
  currentQuestionAnswerGroup: AnswerGroupDto[];
  valueTypeAnswer: string;
  userId: number;
}

@UseGuards(JwtAuthGuard)
@Controller('answers-groups')
export class AnswerGroupController {
  constructor(
    private readonly answerGroupService: AnswerGroupService,
    private readonly historyService: HistoryService,
  ) {}

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
      await this.historyService.createHistory(
        CONSTANTS.HISTORY_TYPE.EDIT_EXAM,
        'Edit Exam: Add Answers',
        dataQuestion.userId,
      );
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {}
  }
}
