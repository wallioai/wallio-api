import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ThreadService } from '../thread.service';
import { Thread } from '../entities/thread.entity';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly threadService: ThreadService,
  ) {}

  @Post('save')
  async create(@Body() createChatDto: CreateChatDto) {
    try {
      const thread = await this.threadService.findOne({
        threadId: createChatDto.threadId,
      });
      if (!thread) {
        throw new Error('Thread not found');
      }

      const payload = {
        content: createChatDto.content,
        threadId: thread._id as unknown as Thread,
        role: createChatDto.role,
      };
      const chat = await this.chatService.create(payload);

      await this.threadService.update(
        { threadId: thread.threadId },
        {
          lastMessageAt: chat.createdAt,
        },
      );

      return chat;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Get('list/:thread')
  async findAll(@Req() req: Request, @Param('thread') threadId: string) {
    const user = req['user'];
    const thread = await this.threadService.findOne({
      threadId,
      userId: user.id,
    });

    if (!thread) {
      throw new Error('Thread not found');
    }

    const chats = await this.chatService.findAll({
      threadId: thread._id,
    });

    return chats.map((chat) => {
      return {
        id: chat._id,
        content: chat.content,
        role: chat.role,
        createdAt: chat.createdAt,
      };
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
