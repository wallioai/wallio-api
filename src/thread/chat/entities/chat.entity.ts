import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Thread } from 'src/thread/entities/thread.entity';

export enum ChatRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
  Tool = 'tool',
  Function = 'function',
}

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thread',
    required: true,
    index: true,
  })
  threadId: Thread;

  @Prop()
  content: string;

  @Prop({ enum: ChatRole, required: true })
  role: ChatRole;

  @Prop()
  lastMessageAt: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
