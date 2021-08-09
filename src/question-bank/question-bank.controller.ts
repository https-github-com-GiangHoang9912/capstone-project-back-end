import { QuestionBankService } from 'src/services/question-bank.service';
import { Controller, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QuestionBankDto } from 'src/dto/question-bank.dto';

@Controller('question-bank')
export class QuestionBankController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  @Post('/create')
  async createQuestion(
    @Res() res: Response,
    @Body() dataQuestion: QuestionBankDto,
  ): Promise<any> {
    try {
      const data = await this.questionBankService.addQuestionNoDuplicateToBank(
        dataQuestion.subjectId,
        dataQuestion.question,
      );
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      console.log('createQuestionBank: ', error);
    }
  }
}
