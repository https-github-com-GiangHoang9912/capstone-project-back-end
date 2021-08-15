import { QuestionBank } from '../entities/question-bank.entity';
import { QuestionService } from './../services/questions.service';
import { ExamService } from '../services/exams.service';
import {
  Body,
  Param,
  Res,
  Controller,
  HttpStatus,
  UseGuards,
  Get,
  Post,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { ExamInfoDto } from '../dto/create-exam.dto';
import { QuestionBankService } from '../services/question-bank.service';

// @UseGuards(JwtAuthGuard)
@Controller('exam')
export class ExamController {
  constructor(
    private readonly examService: ExamService,
    private readonly questionBankService: QuestionBankService,
    private readonly questionService: QuestionService,
  ) {}

  @Get('/:id/')
  async getExamAndSubjectbyUser(
    @Res() res: Response,
    @Param('id') userId: number,
  ): Promise<any> {
    console.log(userId);
    try {
      const data = await this.examService.getExamAndSubjectByUser(userId);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      console.log('getExamAndSubjectbyUser: ', error);
    }
  }

  @Get('/:id/search/:nameExam/')
  async searchExamByName(
    @Res() res: Response,
    @Param('id') id: number,
    @Param('nameExam') examName: string,
  ): Promise<any> {
    try {
      const data = await this.examService.searchExamByName(id, examName);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      console.log('searchExamByName: ', error);
    }
  }

  @Delete('/delete-exam/:id')
  async deleteExamById(
    @Res() res: Response,
    @Param('id') id: number,
  ): Promise<any> {
    try {
      console.log(id);
      const data = await this.examService.deleteExam(id);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      console.log('Delete exam: ', error);
    }
  }

  @Post('/create-exam/:id')
  async createExam(
    @Res() res: Response,
    @Body() examInfo: ExamInfoDto,
    @Param('id') userId: number,
  ): Promise<any> {
    try {
      const listQuestionBank =
        await this.questionBankService.getQuestionBankBySubjectId(
          examInfo.subjectId,
        );
      const exam = await this.examService.createExam(
        examInfo.subjectId,
        examInfo.examName,
        userId,
      );
      const randomQuestion = this.getRandom(listQuestionBank, 10);
      randomQuestion.forEach(async (question) => {
        const ques = await this.questionService.createQuestion(question, exam);
        console.log(ques);
      });

      return res.status(HttpStatus.OK).send(exam);
    } catch (error) {
      console.log('createExam: ', error);
    }
  }

  getRandom(arr: QuestionBank[], n: number) {
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError('getRandom: more elements taken than available');
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }
}
