import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './entities/chat.entity';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private model: Model<Chat>) {}

  create(payload: Partial<Chat>) {
    return this.model.create(payload);
  }

  findAll(filter: FilterQuery<Chat>) {
    return this.model.find(filter);
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  async removeMany(
    filter: FilterQuery<Chat>,
  ): Promise<{ deletedCount?: number }> {
    return await this.model
      .deleteMany(filter)
      .then((res) => ({ deletedCount: res.deletedCount }));
  }
}
