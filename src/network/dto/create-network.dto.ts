import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { NetworkType } from '../entities/network.entity';

export class CreateNetworkDto {
  @IsString()
  chainId: string;

  @IsOptional()
  symbol: string;

  @IsString()
  currency: string;

  @IsString()
  name: string;

  @IsString()
  nameId: string;

  @IsString()
  shortName: string;

  @IsOptional()
  rpcUrls?: string;

  @IsArray()
  rpcIds?: string[];

  @IsArray()
  wssUrls?: string[];

  @IsString()
  explorerUrl: string;

  @IsBoolean()
  isEnabled: boolean;

  @IsBoolean()
  isActive: boolean;

  @IsEnum(NetworkType)
  type: NetworkType;

  @IsOptional()
  coingeckoId?: string;

  @IsOptional()
  multicallAddress?: string;

  @IsString()
  icon: string;
}
