import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { UserService } from 'src/user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { WebAuth, WebAuthDocument } from './entities/webauth.entity';
import { FilterQuery, Model } from 'mongoose';
import { CreateWebAuth } from './dto/webauthn.dto';
import { UserDocument } from 'src/user/entities/user.entity';
import {
  generateRegistrationOptions,
  generateAuthenticationOptions,
  AuthenticatorTransportFuture,
} from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { generateId } from 'src/utils/helpers';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private rpID: string;
  constructor(
    @InjectModel(WebAuth.name) private webAuthModel: Model<WebAuth>,
    private readonly userService: UserService,
    private readonly config: ConfigService,
  ) {
    this.rpID = this.config.get<string>('app.hostname');
  }
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(filter: FilterQuery<WebAuth>) {
    return this.webAuthModel.findOne(filter);
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  generateUniqueId() {
    const id = generateId({ length: 32, dictionary: 'alphanum', isUUID: true });
    return isoBase64URL.fromUTF8String(id);
  }

  async generateRegistionCredentials(user: Partial<UserDocument>) {
    const userId = isoBase64URL.toBuffer(user.uniqueId, 'base64url');
    const options = await generateRegistrationOptions({
      rpID: this.rpID,
      rpName: 'Dexa Smart Wallet',
      userName: user.email,
      userDisplayName: user.name,
      userID: userId,
    });
    console.log(options.user.id);
    await this.setWebAuth({
      user: user._id.toString(),
      id: options.user.id,
      challenge: options.challenge,
      email: user.email,
    });
    return options;
  }
  async generateLoginCredentials(webAuth: Partial<WebAuthDocument>) {
    if (!webAuth) return;
    const options = await generateAuthenticationOptions({
      rpID: this.rpID,
      allowCredentials: [
        {
          id: webAuth.id,
          transports: webAuth.transports as AuthenticatorTransportFuture[],
        },
      ],
      userVerification: 'required',
    });
    await this.updateWebAuth(
      { id: webAuth.id },
      { challenge: options.challenge },
    );
    return options;
  }
  async validateGoogleAuth(payload: GoogleAuthDto) {
    const user = await this.userService.findOne({
      email: payload.email.toLowerCase(),
    });
    if (user) return user;

    return await this.userService.create({
      email: payload.email,
      name: payload.name,
      uniqueId: this.generateUniqueId(),
      avatar: payload.picture,
    });
  }

  async getWebAuth(filter: FilterQuery<WebAuth>) {
    return await this.webAuthModel.findOne(filter);
  }

  async setWebAuth(body: CreateWebAuth) {
    return await this.webAuthModel.create(body);
  }

  async updateWebAuth(filter: FilterQuery<WebAuth>, body: Partial<WebAuth>) {
    return await this.webAuthModel.findOneAndUpdate(filter, body, {
      new: true,
    });
  }
}
