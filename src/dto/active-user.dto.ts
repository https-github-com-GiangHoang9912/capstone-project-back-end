import { IsBoolean, IsNumber } from 'class-validator';

export class ActiveUser {
  @IsNumber()
  readonly id: Number;

  @IsBoolean()
  readonly active: boolean;
}
