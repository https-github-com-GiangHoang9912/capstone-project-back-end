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
  Put
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  @Delete('/delete/:id/')
  async deleteQuestionById(
    @Res() res: Response,
    @Param('id') questionId: number,
  ): Promise<any> {
    console.log(questionId);
    try {
      const data = await this.questionService.deleteQuestion(
        questionId
      );
      return res.status(HttpStatus.OK).send(data);

    } catch (error) {
      console.log('Fail delete question: ', error);
    }
  }

  @Get('/examId/:id/')
  async getQuestionByExamId(
    @Res() res: Response,
    @Param('id') examId: number,
  ): Promise<any> {
    console.log(examId);
    try {
      const data = await this.questionService.getQuestionsByExamId(
        examId
      );
      return res.status(HttpStatus.OK).send(data);

    } catch (error) {
      console.log('Fail get question by exam id: ', error);
    }
  }

  @Get('/:id/')
  async getQuestionDetail(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<any> {
    console.log(id);
    try {
      const data = await this.questionService.getQuestionDetail(
        id
      );
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      console.log('Fail get question detail: ', error);
    }
  }


  @Post('/create/')
  async createQuestion(
    @Res() res: Response,
    @Body() dataQuestion: any,
  ): Promise<any> {
    try {
      dataQuestion.map(async (item: any) => {
        const data = await this.questionService.createNewQuestion(
          item.questionBankId,
          item.examId
        )
        return res.status(HttpStatus.OK).send(data);
      })
    } catch (error) {
      console.log('Fail create answer group: ', error);
    }
  }
  @Put('/update/:id')
  async updateQuestion(
    @Res() res: Response,
    @Body() dataQuestion: any,
    @Param('id') questionId: number,
  ): Promise<any> {
    try {
      const updateQuestion = await this.questionService.updateQuestion(
        questionId,
        dataQuestion.answerGroupId
      )
      return res.status(HttpStatus.OK).send(updateQuestion);
    } catch (error) {
      return {
        message: 'update question fail...!',
      };
    }
  }

}