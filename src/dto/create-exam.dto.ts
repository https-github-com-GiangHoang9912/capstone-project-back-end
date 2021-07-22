import { IsString, IsNumber } from 'class-validator';

export class ExamInfoDto {
  @IsNumber()
  readonly subjectId: number;

  @IsString()
  readonly examName: string;
}
