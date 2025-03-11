import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NetworkDocument = HydratedDocument<Network>;

export enum NetworkType {
  testnet = 'testnet',
  mainnet = 'mainnet',
}

class NativeCurrency {
  symbol: string;
  decimal: number;
  address: string;
}

@Schema({ timestamps: true })
export class Network {
  @Prop({ unique: true, required: true, index: true })
  chainId: number;

  @Prop()
  tokenType?: string;

  @Prop({ type: NativeCurrency })
  nativeCurrency: NativeCurrency;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  nameId: string;

  @Prop()
  shortName: string;

  @Prop()
  rpcUrls?: string[];

  @Prop()
  wssUrls?: string[];

  @Prop()
  explorerUrl: string;

  @Prop()
  multicallAddress: string;

  @Prop()
  cgPlatformId?: string;

  @Prop()
  cgCategoryId?: string;

  @Prop()
  cgCoinId?: string;

  @Prop()
  deBridgeId?: number;

  @Prop({ default: false })
  isEnabled: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ enum: NetworkType, required: true })
  type: NetworkType;

  @Prop()
  icon: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const NetworkSchema = SchemaFactory.createForClass(Network);
