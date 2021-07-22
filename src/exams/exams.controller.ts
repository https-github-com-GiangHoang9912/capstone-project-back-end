import { ExamService } from '../services/exams.service';
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

@UseGuards(JwtAuthGuard)
@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}
  @Get('/:id/')
  async getExamsByUser(
    @Res() res: Response,
    @Param('id') userId: number,
  ): Promise<any> {
    console.log(userId);
    try {
      const data = await this.examService.getExamByUser(
        userId
      );
      return res.status(HttpStatus.OK).send(data);

    } catch (error) {}
  }

  @Get('/create-exam')
  async createExam(
    @Res() res: Response,
    @Param('id') userId: number,
  ): Promise<any> {
    console.log(userId);
    try {
      const data = await this.examService.getExamByUser(
        userId
      );
      return res.status(HttpStatus.OK).send(data);

    } catch (error) {}
  }
}