import { IsString, IsNumber } from 'class-validator';

export class ChangePasswordDto {
  @IsNumber()
  readonly userId: number;

  @IsString()
  readonly oldPassword: string;

  @IsString()
  readonly newPassword: string;
}
