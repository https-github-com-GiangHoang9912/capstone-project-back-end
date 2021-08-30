import { IsNumber } from 'class-validator';

export class QuestionDto {
  @IsNumber()
  readonly questionBankId?: number[];

  @IsNumber()
  readonly examId?: number;

  @IsNumber()
  readonly answerGroupId?: number;

  
}
