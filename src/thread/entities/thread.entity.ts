import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

export type ThreadDocument = HydratedDocument<Thread>;

@Schema({ timestamps: true })
export class Thread {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, index: true, unique: true })
  threadId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: User;

  @Prop()
  lastMessageAt: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);
