import { IsNumber, IsBoolean } from 'class-validator';
import { AnswerDto } from "./answer.dto"
export class AnswerGroupDto {
  @IsNumber()
  readonly id?: number;

  @IsBoolean()
  readonly correct?: boolean;

  @IsNumber()
  readonly answer?: AnswerDto;
}