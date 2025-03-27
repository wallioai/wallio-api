import { Module } from '@nestjs/common';
import { DebridgeService } from './debridge.service';
import { DebridgeController } from './debridge.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [DebridgeController],
  providers: [DebridgeService],
  exports: [DebridgeService],
})
export class DebridgeModule {}
