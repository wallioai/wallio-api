import { Module } from '@nestjs/common';
import { BridgeService } from './bridge.service';
import { BridgeController } from './bridge.controller';
import { HttpModule } from '@nestjs/axios';
import { DebridgeModule } from './debridge/debridge.module';

@Module({
  imports: [HttpModule, DebridgeModule],
  controllers: [BridgeController],
  providers: [BridgeService],
})
export class BridgeModule {}
