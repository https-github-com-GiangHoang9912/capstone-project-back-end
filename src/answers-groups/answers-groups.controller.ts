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
  Post
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('answers-groups')
export class AnswerGroupController {
  constructor(private readonly answerGroupService: AnswerGroupService) { }

  @Get('/')
  async getAnswersGroups(@Res() res: Response): Promise<any> {
    try {
      const data = await this.answerGroupService.getAnswersGroups();
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      console.log('getAnswersGroups', error);
    }
  }

  @Get('/:id')
  async getAnswersGroupsById(
    @Res() res: Response,
    @Param('id') id: number
  ): Promise<any> {
    try {
      const data = await this.answerGroupService.getAnswersGroupsById(id);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      console.log('getAnswersGroupsById', error);
    }
  }

  @Post('/create/:id')
  async createAnswerGroup(
    @Res() res: Response,
    @Param() idQuestion: number,
    @Body() dataQuestion: any,
  ): Promise<any> {
    try {
      await this.answerGroupService.deleteAnswerGroup(idQuestion);
      let data = null;
      dataQuestion.currentQuestionAnswerGroup.map(async (item: any) => {
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
            item.answer.answerText
          );
        }
        return res.status(HttpStatus.OK).send(data);
      });
    } catch (error) {
      console.log('createAnswerGroup: ', error);
    }
  }

  @Put('/update/multiple/:id')
  async updateAnswerGroupMultiple(
    @Res() res: Response,
    @Param() idQuestion: number,
    @Body() dataAnswerGroup: any,

  ): Promise<any> {
    try {
      dataAnswerGroup.map(async (item: any) => {
        if (item.questionId) {
          const data = await this.answerGroupService.updateAnswerGroupTrueFalse(
            item.id,
            item.correct
          );
          return data;
        } else {
          const data = await this.answerGroupService.createAnswerGroupMultiple(
            idQuestion,
            item.correct,
            item.answer.answerText
          );
          return data;
        }
      })
      return res.status(HttpStatus.OK).send(dataAnswerGroup);
    } catch (error) {
      console.log('updateAnswerGroupMultiple', error);
    }
  }

  @Put('/update')
  async updateAnswerGroupTrueFalse(
    @Res() res: Response,
    @Body() dataAnswerGroup: any,

  ): Promise<any> {
    try {
      dataAnswerGroup.map(async (item: any) => {
        const data = await this.answerGroupService.updateAnswerGroupTrueFalse(
          item.id,
          item.correct
        );
        return data;
      })
      return res.status(HttpStatus.OK).send(dataAnswerGroup);
    } catch (error) {
      console.log('updateAnswerGroupTrueFalse', error);
    }
  }

}
