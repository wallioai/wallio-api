import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './entities/token.entity';
import { NetworkModule } from 'src/network/network.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    NetworkModule,
    HttpModule,
  ],
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule {}
