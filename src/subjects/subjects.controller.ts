import { CreateSubjectDto } from './../dto/subject.dto';
import { SubjectService } from '../services/subjects.service';
import {
  Body,
  Res,
  Controller,
  HttpStatus,
  UseGuards,
  Param,
  Get,
  Post,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get('/')
  async getSubject(@Res() res: Response): Promise<any> {
    try {
      const data = await this.subjectService.getSubject();
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {}
  }
  @Post('/create')
  async createSubject(@Body() subject: CreateSubjectDto, @Res() res: Response): Promise<any> {
    try {
      const data = await this.subjectService.createSubject(subject.subjectName);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {}
  }

  @Get('/:id/')
  async getExamAndSubjectbyUser(
    @Res() res: Response,
    @Param('id') subjectId: number,
  ): Promise<any> {
    try {
      const data = await this.subjectService.getQuestionBankBySubjectId(
        subjectId,
      );
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {}
  }
}
