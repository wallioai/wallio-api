import { IsString } from 'class-validator';

export class VerifyWebAuthDto {
  @IsString()
  options: string;

  @IsString()
  email: string;
}

export class CreateWebAuth {
  @IsString()
  user: string;

  @IsString()
  id: string;

  @IsString()
  challenge: string;

  @IsString()
  email: string;
}

export class InitLoginWebAuth {
  @IsString()
  email: string;
}
