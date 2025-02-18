import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true })
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

  @Prop()
  emailVerified: boolean;

  @Prop({ default: false })
  isOnboarded: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
