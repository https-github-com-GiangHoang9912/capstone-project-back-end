import { QuestionService } from '../services/questions.service';
import {
  Body,
  Res,
  Param,
  Controller,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  @Get('/:id/')
  async getExamAndSubjectbyUser(
    @Res() res: Response,
    @Param('id') examId: number,
  ): Promise<any> {
    console.log(examId);
    try {
      const data = await this.questionService.getQuestionDetail(
        examId
      );
      return res.status(HttpStatus.OK).send(data);

    } catch (error) {
      console.log('Fail connect: ', error);
    }
  }
}