import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WebAuth, WebAuthSchema } from './entities/webauth.entity';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: WebAuth.name, schema: WebAuthSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
