import { IsEnum, IsString } from 'class-validator';
import { WalletType } from '../entities/wallet.entity';

export class CreateWalletDto {
  @IsString()
  address: string;

  @IsEnum(WalletType)
  type: WalletType;
}
