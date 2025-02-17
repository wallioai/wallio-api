import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { GoogleAuthGuard } from 'src/guards/google/google-auth.guard';
import { Public } from 'src/decorators/public.decorator';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  verifyAuthenticationResponse,
  type RegistrationResponseJSON,
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
} from '@simplewebauthn/server';
import { InitLoginWebAuth, VerifyWebAuthDto } from './dto/webauthn.dto';
import { isoBase64URL, isoUint8Array } from '@simplewebauthn/server/helpers';
import { generateId } from 'src/utils/helpers';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private rpID: string;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly config: ConfigService,
  ) {
    this.rpID = this.config.get<string>('app.hostname');
  }

  @Public()
  @Post('register/webauthn')
  async initRegisterWebAuth(@Req() req: Request, @Body() body: CreateAuthDto) {
    const user = await this.userService.findOne({
      email: body.email.toLowerCase(),
    });

    if (body.fromGoogle && user) {
      return await this.authService.generateRegistionCredentials(user);
    }

    if (user) {
      throw new ConflictException('User already registered');
    }

    const newUser = await this.userService.create({
      email: body.email,
      name: body.name,
      uniqueId: generateId({ length: 64, dictionary: 'hex' }),
    });

    const options =
      await this.authService.generateRegistionCredentials(newUser);

    return options;
  }

  @Post('register/webauthn/verify')
  async verifyRegisterWebAuth(
    @Req() req: Request,
    @Body() body: VerifyWebAuthDto,
  ) {
    const options = JSON.parse(body.options) as RegistrationResponseJSON;
    const webAuth = await this.authService.getWebAuth({ email: body.email });
    if (!webAuth) {
      throw new NotFoundException();
    }
    const response = await verifyRegistrationResponse({
      response: options,
      expectedChallenge: webAuth.challenge,
      expectedOrigin: 'http://localhost:3000',
      expectedRPID: this.rpID,
    });

    if (response.verified) {
      const publicKey = isoBase64URL.fromBuffer(
        response.registrationInfo.credential.publicKey,
        'base64url',
      );
      await this.authService.updateWebAuth(
        { email: body.email },
        {
          publicKey,
          deviceType: response.registrationInfo.credentialDeviceType,
          counter: response.registrationInfo.credential.counter,
          credentialBackedUp: response.registrationInfo.credentialBackedUp,
          transports: response.registrationInfo.credential.transports,
        },
      );

      return {
        message: 'Webauth verified successfully',
        verified: response.verified,
        registrationInfo: {
          ...response.registrationInfo,
        },
      };
    }

    return {
      verified: response.verified,
      message: 'Webauth verification failed',
    };
  }

  @Public()
  @Get('login/webauthn/:email')
  async initLoginWebAuth(@Param('email') email: string) {
    const [webauth, user] = await Promise.all([
      this.authService.getWebAuth({ email: email.toLowerCase() }),
      this.userService.findOne({
        email: email.toLowerCase(),
      }),
    ]);
    if (!webauth || !user) {
      throw new NotFoundException('User not found');
    }

    return await this.authService.generateLoginCredentials(webauth);
  }

  @Post('login/webauthn/verify')
  async verifyLoginWebAuth(
    @Req() req: Request,
    @Body() body: VerifyWebAuthDto,
  ) {
    const options = JSON.parse(body.options) as AuthenticationResponseJSON;
    const webAuth = await this.authService.getWebAuth({ email: body.email });
    if (!webAuth) {
      throw new NotFoundException();
    }

    const response = await verifyAuthenticationResponse({
      response: options,
      expectedChallenge: webAuth.challenge,
      expectedOrigin: 'http://localhost:3000',
      expectedRPID: this.rpID,
      credential: {
        id: webAuth.id,
        publicKey: isoBase64URL.toBuffer(webAuth.publicKey, 'base64url'),
        counter: webAuth.counter,
        transports: webAuth.transports as AuthenticatorTransportFuture[],
      },
    });

    if (response.verified) {
      return {
        message: 'Webauth verified successfully',
        verified: response.verified,
        authenticationInfo: {
          publicKey: isoBase64URL.toBuffer(webAuth.publicKey, 'base64url'),
        },
      };
    }

    return {
      verified: response.verified,
      message: 'Webauth verification failed',
    };
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const googleUser = req['user'];
    const [webauth, userAuth] = await Promise.all([
      this.authService.getWebAuth({ email: googleUser.email.toLowerCase() }),
      this.userService.findOne({
        email: googleUser.email.toLowerCase(),
      }),
    ]);

    let type: 'login' | 'register';
    if (userAuth && webauth) {
      type = 'login';
    } else if (userAuth && !webauth) {
      type = 'register';
    }

    res.redirect(
      `http://localhost:3000/auth/callback#?email=${userAuth.email}&type=${type}&name=${userAuth.name}`,
    );
  }
}