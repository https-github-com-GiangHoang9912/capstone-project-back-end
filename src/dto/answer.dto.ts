import { IsString } from 'class-validator';

export class AnswerDto {
  @IsString()
  readonly answerText: string;
}
