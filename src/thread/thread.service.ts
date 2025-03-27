import { Injectable } from '@nestjs/common';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Thread } from './entities/thread.entity';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class ThreadService {
  constructor(@InjectModel(Thread.name) private model: Model<Thread>) {}

  create(thread: Partial<Thread>) {
    return this.model.create(thread);
  }

  findAll(filter: FilterQuery<Thread>) {
    return this.model.find(filter).sort('-lastMessageAt').lean();
  }

  findOne(filter: FilterQuery<Thread>) {
    return this.model.findOne(filter).lean();
  }

  update(filter: FilterQuery<Thread>, update: Partial<Thread>) {
    return this.model.findOneAndUpdate(filter, update, { new: true });
  }

  remove(filter: FilterQuery<Thread>) {
    return this.model.findOneAndDelete(filter);
  }

  async removeMany(filter: FilterQuery<Thread>): Promise<{ deletedCount?: number }> {
    return this.model
      .deleteMany(filter)
      .then((res) => ({ deletedCount: res.deletedCount }));
  }
}
