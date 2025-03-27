import { forwardRef, Module } from '@nestjs/common';
import { ThreadService } from './thread.service';
import { ThreadController } from './thread.controller';
import { ChatModule } from './chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Thread, ThreadSchema } from './entities/thread.entity';

@Module({
  imports: [
    forwardRef(() => ChatModule),
    MongooseModule.forFeature([{ name: Thread.name, schema: ThreadSchema }]),
  ],
  controllers: [ThreadController],
  providers: [ThreadService],
  exports: [ThreadService],
})
export class ThreadModule {}
