import { IsString, IsNumber } from 'class-validator';

export class QuestionCheckDuplicatedDto {
  @IsNumber()
  readonly subjectId?: number;

  @IsString()
  readonly question: string;
}
