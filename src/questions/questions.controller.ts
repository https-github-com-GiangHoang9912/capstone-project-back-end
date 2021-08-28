import { QuestionService } from '../services/questions.service';
import {
  Body,
  Res,
  Param,
  Controller,
  HttpStatus,
  UseGuards,
  Get,
  Delete,
  Post,
  Put,
} from '@nestjs/common';
import { Response } from 'express';
import { QuestionDto } from '../dto/question.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HistoryService } from '../services/histories.service';
import * as CONSTANTS from '../constant';
@UseGuards(JwtAuthGuard)
@Controller('questions')

export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly historyService: HistoryService,
    ) {}
  @Delete('/delete/:id/')
  async deleteQuestionById(
    @Res() res: Response,
    @Param('id') questionId: number,
  ): Promise<any> {
    try {
      const data = await this.questionService.deleteQuestion(questionId);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {}
  }

  @Get('/examId/:id/')
  async getQuestionByExamId(
    @Res() res: Response,
    @Param('id') examId: number,
  ): Promise<any> {
    try {
      const data = await this.questionService.getQuestionsByExamId(examId);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {}
  }

  @Get('/:id/')
  async getQuestionDetail(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<any> {
    try {
      const data = await this.questionService.getQuestionDetail(id);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {}
  }

  @Post('/create/:id')
  async createQuestion(
    @Res() res: Response,
    @Param('id') userId: number,
    @Body() dataQuestion: QuestionDto[],
  ): Promise<any> {
    try {
      const newData = dataQuestion.map(async (item: QuestionDto) => {
        const data = await this.questionService.createNewQuestion(
          item.questionBankId,
          item.examId,
        );
        await this.historyService.createHistory(
          CONSTANTS.HISTORY_TYPE.EDIT_EXAM,
          'Edit Exam',
          userId,
        );
        return data;
      });
      return res.status(HttpStatus.OK).send(newData);
    } catch (error) {}
  }

  @Put('/update/:id')
  async updateQuestion(
    @Res() res: Response,
    @Body() dataQuestion: QuestionDto,
    @Param('id') questionId: number,
  ): Promise<any> {
    try {
      const updateQuestion = await this.questionService.updateQuestion(
        questionId,
        dataQuestion.answerGroupId,
      );
      return res.status(HttpStatus.OK).send(updateQuestion);
    } catch (error) {}
  }
}
