import { IsNumber, IsString } from 'class-validator';

export class EditSubjectDto {
  @IsNumber()
  readonly subjectId?: number;
  @IsString()
  readonly subjectName?: string;
}
