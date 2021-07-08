import { IsString } from 'class-validator';

export class SelfGenerationDto {
  @IsString()
  readonly answer: string;
  @IsString()
  readonly context: string;
}
