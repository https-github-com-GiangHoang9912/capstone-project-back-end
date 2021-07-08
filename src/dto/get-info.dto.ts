import { IsString } from 'class-validator';

export class GetInformationDto {
  @IsString()
  readonly username: string;
}
