import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ThreadService } from './thread.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { Request } from 'express';
import { ChatService } from './chat/chat.service';

@Controller('thread')
export class ThreadController {
  constructor(
    private readonly threadService: ThreadService,
    private readonly chatService: ChatService,
  ) {}

  @Post('create')
  async create(@Req() req: Request, @Body() createThreadDto: CreateThreadDto) {
    const user = req['user'];
    const allThread = await this.threadService.findAll({ userId: user.id });
    const title = `Conversation ${allThread.length + 1}`;
    const thread = {
      title: createThreadDto.title ?? title,
      threadId: createThreadDto.threadId,
      userId: user.id,
    };
    return this.threadService.create(thread);
  }

  @Get('list')
  async findAll(@Req() req: Request) {
    const user = req['user'];
    const allThread = await this.threadService.findAll({
      userId: user.id,
    });
    return allThread;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    //return this.threadService.findOne(+id);
  }

  @Patch('update/:id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateThreadDto: UpdateThreadDto,
  ) {
    const user = req['user'];
    const thread = await this.threadService.findOne({
      userId: user.id,
      threadId: id,
    });

    if (!thread) {
      throw new NotFoundException();
    }

    return this.threadService.update(
      { threadId: id },
      { title: updateThreadDto.title },
    );
  }

  @Delete('delete/:id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    console.log(id);
    const user = req['user'];
    const thread = await this.threadService.findOne({
      userId: user.id,
      threadId: id,
    });

    if (!thread) {
      throw new NotFoundException();
    }

    await this.chatService.removeMany({ threadId: thread._id });
    return await this.threadService.remove({ threadId: id, userId: user.id });
  }
}
