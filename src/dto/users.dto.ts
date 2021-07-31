import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly userName: string;

  @IsString()
  readonly password: string;

  @IsNumber()
  readonly role?: number;

  @IsBoolean()
  readonly active?: boolean;

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
}
