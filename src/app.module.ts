import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import googleConfig from './config/google.config';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AuthGuard } from './guards/auth/auth.guard';
import { AppGuard } from './guards/app/app.guard';
import { AgentModule } from './agent/agent.module';
import { NetworkModule } from './network/network.module';
import { TokenModule } from './token/token.module';
import { WalletModule } from './wallet/wallet.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ThreadModule } from './thread/thread.module';
import { BridgeModule } from './bridge/bridge.module';
import KeyvMongo from '@keyv/mongo';
import Keyv from 'keyv';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
      cache: true,
      load: [appConfig, authConfig, googleConfig],
      expandVariables: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('app.db'),
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [
            new Keyv(
              new KeyvMongo('mongodb://127.0.0.1:27017/sonic-smart-wallet', {
                collection: 'cache',
              }),
              {
                ttl: 60 * 60 * 1000,
              },
            ),
          ],
        };
      },
    }),
    HttpModule,
    AuthModule,
    UserModule,
    AgentModule,
    NetworkModule,
    TokenModule,
    WalletModule,
    ThreadModule,
    BridgeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    GoogleStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AppGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
