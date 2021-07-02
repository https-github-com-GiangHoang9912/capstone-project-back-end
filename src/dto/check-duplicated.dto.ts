import { IsString } from 'class-validator';

export class QuestionCheckDuplicatedDto {
  @IsString()
  readonly question: string;
}
