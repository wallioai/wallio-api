import { IsEnum, IsString } from 'class-validator';
import { ChatRole } from '../entities/chat.entity';

export class CreateChatDto {
  @IsString()
  threadId: string;

  @IsString()
  content: string;

  @IsEnum(ChatRole)
  role: ChatRole;
}
