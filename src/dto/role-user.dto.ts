import { IsString, IsNumber } from 'class-validator';

export class RoleUser {
  @IsNumber()
  readonly roleId: Number;

  @IsString()
  readonly roleValue: string;
}
