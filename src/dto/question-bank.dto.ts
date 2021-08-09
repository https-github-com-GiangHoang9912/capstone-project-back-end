import { IsString, IsNumber } from 'class-validator';

export class QuestionBankDto {
  @IsString()
  readonly question?: string;

  @IsNumber()
  readonly subjectId?: number;
}
