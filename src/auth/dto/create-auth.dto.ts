import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  fromGoogle: boolean;
}
