import { QuestionBankService } from 'src/services/question-bank.service';
import { Controller, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('question-bank')
export class QuestionBankController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  @Post('/create')
  async createQuestion(
    @Res() res: Response,
    @Body() dataQuestion: any,
  ): Promise<any> {
    try {
      const data = await this.questionBankService.addQuestionNoDuplicateToBank(
        dataQuestion.question,
        dataQuestion.subjectId,
      );
      return res.status(HttpStatus.OK).send(data);
    } catch (error) {
      console.log('createQuestionBank: ', error);
    }
  }
}
