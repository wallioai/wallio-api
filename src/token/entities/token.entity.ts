import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Network } from '../../network/entities/network.entity';

export type TokenDocument = HydratedDocument<Token>;

@Schema({ timestamps: true })
export class Token {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Network',
    required: true,
  })
  network: Network;

  @Prop()
  chainId: number;

  @Prop({ lowercase: true })
  address: string;

  @Prop({ lowercase: true })
  aggregator: string;

  @Prop()
  name: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  decimal: number;

  @Prop({ default: false })
  isEnabled: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  icon: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
