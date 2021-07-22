import { ExamService } from './../services/exam.service';
import {
  Body,
  Param,
  Res,
  Controller,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) { }

  @Get('/:id/')
  async getExamAndSubjectbyUser(
    @Res() res: Response,
    @Param('id') userId: number,
  ): Promise<any> {
    console.log(userId);
    try {
      const data = await this.examService.getExamAndSubjectbyUser(
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

  @Get('/')
  async getExam(@Res() res: Response): Promise<any> {
    try {
      const data = await this.examService.getExam();
      return res.status(HttpStatus.OK).send(data);
    } catch (error) { }
  }

}