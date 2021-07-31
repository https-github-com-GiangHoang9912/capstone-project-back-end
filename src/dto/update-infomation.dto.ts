import { IsString, IsNumber } from 'class-validator';

export class UpdateInformationDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly firstName?: string;

  @IsString()
  readonly lastName?: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly phone?: string;

  @IsString()
  readonly address?: string;

  @IsString()
  readonly dob?: string;

  @IsString()
  readonly avatar?: string;
}
