import { ExamService } from './../services/exam.service';
import {
  Body,
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

  @Get('/')
  async getExam(@Res() res: Response): Promise<any> {
    try {
      const data = await this.examService.getExam();
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {}
  }
}