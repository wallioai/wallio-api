import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateTokenDto {
  @IsNumber()
  chainId: number;

  @IsString()
  network: string;

  @IsString()
  token: string;

  @IsString()
  address: string;

  @IsString()
  aggregator: string;

  @IsString()
  name: string;

  @IsString()
  symbol: string;

  @IsString()
  icon: string;
}
