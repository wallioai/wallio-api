import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet, WalletType } from './entities/wallet.entity';
import { Model, Types } from 'mongoose';
import { base64URLStringToPublicKey } from 'src/utils/helpers';
import { toWebAuthnAccount } from 'viem/account-abstraction';
import { createPublicClient, http } from 'viem';
import { sonicTestnet } from 'viem/chains';
import { toWallioSmartAccount } from './account/account/toWallioSmartAccount';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class WalletService {
  constructor(@InjectModel(Wallet.name) private wallet: Model<Wallet>) {}

  create(body: Partial<Wallet>) {
    return this.wallet.create(body);
  }

  findAll() {
    return `This action returns all wallet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }

  async generateSmartAccount(
    attestationObject: string,
    id: string,
    rpId: string,
    userId: Types.ObjectId,
  ) {
    const walletPubKey = await base64URLStringToPublicKey(attestationObject);
    const owner = toWebAuthnAccount({
      credential: {
        id,
        publicKey: walletPubKey,
      },
      rpId,
    });
    const smartAccount = await toWallioSmartAccount({
      //@ts-ignore
      client: createPublicClient({
        chain: sonicTestnet,
        transport: http('https://rpc.blaze.soniclabs.com'),
      }),
      owner,
    });
    const address = await smartAccount.getAddress();
    await this.create({
      address,
      type: WalletType.Smart,
      user: userId as unknown as User,
    });
  }
}
