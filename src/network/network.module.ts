import { Module } from '@nestjs/common';
import { NetworkService } from './network.service';
import { NetworkController } from './network.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Network, NetworkSchema } from './entities/network.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Network.name, schema: NetworkSchema }]),
  ],
  controllers: [NetworkController],
  providers: [NetworkService],
  exports: [NetworkService],
})
export class NetworkModule {}
