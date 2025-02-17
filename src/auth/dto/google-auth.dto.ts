import { IsString } from 'class-validator';

export class GoogleAuthDto {
  @IsString()
  id: string;
  
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  picture: string;
}
