import { EditSubjectDto } from './../dto/edit-subject.dto';
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
  Delete,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DeleteSubjectDto } from 'src/dto/delete-subject.dto';

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
  async createSubject(
    @Body() subject: CreateSubjectDto,
    @Res() res: Response,
  ): Promise<any> {
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

  @Post('/edit')
  async editSubject(
    @Body() subject: EditSubjectDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const data = await this.subjectService.editSubject(
        subject.subjectId,
        subject.subjectName,
      );
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {}
  }

  @Post('/delete')
  async deleteSubject(
    @Body() subject: DeleteSubjectDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      await this.subjectService.deleteSubject(subject.subjectId);
      const newArraySubject = await this.subjectService.getSubject()
      return res.status(HttpStatus.OK).send(newArraySubject);
    } catch (error) {}
  }

  @Get('/search/:subjectName/')
  async searchExamByName(
    @Res() res: Response,
    @Param('subjectName') subjectName: string,
  ): Promise<any> {
    try {
      const data = await this.subjectService.searchSubjectByName(subjectName);
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {}
  }
}
