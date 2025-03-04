import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

export type WalletDocument = HydratedDocument<Wallet>;

export enum WalletType {
  Smart = 'smart-wallet',
  DeFi = 'defi-wallet',
}

@Schema({ timestamps: true })
export class Wallet {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ unique: true })
  address: string;

  @Prop({ enum: WalletType, required: true })
  type: WalletType;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
