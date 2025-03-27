import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

export type WebAuthChallengeDocument = HydratedDocument<WebAuthChallenge>;

@Schema({ timestamps: true })
export class WebAuthChallenge {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop()
  challenge: string;

  @Prop()
  credentialBackedUp: boolean;
}

export const WebAuthChallengeSchema = SchemaFactory.createForClass(WebAuthChallenge);
