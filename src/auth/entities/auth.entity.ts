import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({ timestamps: true })
export class Auth {
  @Prop({ required: true, unique: true, select: false })
  uniqueId: string;

  @Prop({ lowercase: true })
  wallet: string;

  @Prop()
  avatar: string;

  @Prop()
  name: string;

  @Prop({ lowercase: true })
  username: string;

  @Prop({ lowercase: true, unique: true, required: true })
  email: string;

  @Prop({ default: false })
  isOnboarded: boolean;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
