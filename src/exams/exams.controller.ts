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
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ExamInfoDto } from 'src/dto/create-exam.dto';
import { QuestionBankService } from 'src/services/question-bank.service';

@UseGuards(JwtAuthGuard)
@Controller('exam')
export class ExamController {
  constructor(
    private readonly examService: ExamService,
    private readonly questionBankService: QuestionBankService, 
  ) { }

  @Get('/:id/')
  async getExamAndSubjectbyUser(
    @Res() res: Response,
    @Param('id') userId: number,
  ): Promise<any> {
    console.log(userId);
    try {
      const data = await this.examService.getExamAndSubjectByUser(
        userId
      );
      return res.status(HttpStatus.OK).send(data);

    } catch (error) {
      console.log('Fail connect: ', error);
    }
  }

  @Get('/search/:nameExam')
  async searchExamByName(
    @Res() res: Response,
    @Param('nameExam') examName: string,
  ): Promise<any> {
    try {
      const data = await this.examService.searchExamByName(examName);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      console.log('Fail search exam: ', error);
    }
  }

  @Post('/create-exam')
  async createExam(
    @Res() res: Response,
    @Body() examInfo: ExamInfoDto,
  ): Promise<any> {
    try {
      const data = await this.examService.createExam(examInfo.subjectId, examInfo.examName);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      console.log('Fail search exam: ', error);
    }
  }
}
