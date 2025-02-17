import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

export type WebAuthDocument = HydratedDocument<WebAuth>;

@Schema({ timestamps: true })
export class WebAuth {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true, unique: true })
  id: string;

  @Prop()
  challenge: string;

  @Prop({ lowercase: true, unique: true })
  email: string;

  @Prop()
  publicKey: string;

  @Prop({ default: 0 })
  counter: number;

  @Prop()
  deviceType: string;

  @Prop()
  credentialBackedUp: boolean;

  @Prop()
  transports: string[];
}

export const WebAuthSchema = SchemaFactory.createForClass(WebAuth);
