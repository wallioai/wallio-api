import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NetworkDocument = HydratedDocument<Network>;

export enum NetworkType {
  testnet = 'testnet',
  mainnet = 'mainnet',
}

@Schema({ timestamps: true })
export class Network {
  @Prop({ unique: true, required: true, index: true })
  chainId: number;

  @Prop()
  symbol?: string;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  nameId: string;

  @Prop()
  shortName: string;

  @Prop()
  coingeckoId?: string;

  @Prop()
  rpcUrls?: string[];

  @Prop()
  wssUrls?: string[];

  @Prop()
  explorerUrl: string;

  @Prop()
  multicallAddress: string;

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
