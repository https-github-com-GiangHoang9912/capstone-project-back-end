import { IsNumber } from 'class-validator';

export class DeleteSubjectDto {
  @IsNumber()
  readonly subjectId?: number;
}
