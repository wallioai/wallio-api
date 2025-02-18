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
import { access } from 'fs';
import { AppGuard } from 'src/guards/app/app.guard';

@Controller('auth')
export class AuthController {
  private rpID: string;
  private origin: string;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly config: ConfigService,
  ) {
    this.rpID = this.config.get<string>('app.hostname');
    this.origin = this.config.get<string>('app.origin');
  }

  @Public()
  @UseGuards(AppGuard)
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

  @Public()
  @UseGuards(AppGuard)
  @Post('register/webauthn/verify')
  async verifyRegisterWebAuth(
    @Req() req: Request,
    @Body() body: VerifyWebAuthDto,
  ) {
    const options = JSON.parse(body.options) as RegistrationResponseJSON;
    const webAuth = await this.authService.getWebAuth({
      email: body.email.toLowerCase(),
    });
    const userData = await this.userService.findOne({
      email: body.email.toLowerCase(),
    });

    if (!webAuth || !userData) {
      throw new NotFoundException();
    }
    const response = await verifyRegistrationResponse({
      response: options,
      expectedChallenge: webAuth.challenge,
      expectedOrigin: this.origin,
      expectedRPID: this.rpID,
    });

    if (response.verified) {
      response.registrationInfo.credential.id;
      const publicKey = isoBase64URL.fromBuffer(
        response.registrationInfo.credential.publicKey,
      );
      await this.authService.updateWebAuth(
        { email: body.email },
        {
          id: response.registrationInfo.credential.id,
          publicKey,
          challenge: null,
          attestationObject: isoBase64URL.fromBuffer(
            response.registrationInfo.attestationObject,
            'base64url',
          ),
          deviceType: response.registrationInfo.credentialDeviceType,
          counter: response.registrationInfo.credential.counter,
          credentialBackedUp: response.registrationInfo.credentialBackedUp,
          transports: response.registrationInfo.credential.transports,
        },
      );

      const payload = {
        id: userData._id.toString(),
        email: userData.email,
        name: userData.name,
        username: userData.username,
        emailVerified: userData.emailVerified,
      };

      const { refreshToken, accessToken } =
        await this.authService.login(payload);

      return {
        refreshToken,
        accessToken,
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
  @UseGuards(AppGuard)
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

  @Public()
  @UseGuards(AppGuard)
  @Post('login/webauthn/verify')
  async verifyLoginWebAuth(
    @Req() req: Request,
    @Body() body: VerifyWebAuthDto,
  ) {
    const options = JSON.parse(body.options) as AuthenticationResponseJSON;
    const webAuth = await this.authService.getWebAuth({
      email: body.email.toLowerCase(),
    });
    const userData = await this.userService.findOne({
      email: body.email.toLowerCase(),
    });
    if (!webAuth || !userData) {
      throw new NotFoundException();
    }

    const response = await verifyAuthenticationResponse({
      response: options,
      expectedChallenge: webAuth.challenge,
      expectedOrigin: this.origin,
      expectedRPID: this.rpID,
      credential: {
        id: webAuth.id,
        publicKey: new Uint8Array(
          isoBase64URL.toBuffer(webAuth.publicKey, 'base64url'),
        ),
        counter: webAuth.counter,
        transports: webAuth.transports as AuthenticatorTransportFuture[],
      },
    });

    if (response.verified) {
      await this.authService.updateWebAuth(
        { email: body.email },
        { challenge: null },
      );

      const payload = {
        id: userData._id.toString(),
        email: userData.email,
        name: userData.name,
        username: userData.username,
        emailVerified: userData.emailVerified,
      };

      const { refreshToken, accessToken } =
        await this.authService.login(payload);

      return {
        refreshToken,
        accessToken,
        message: 'Webauth verified successfully',
        verified: response.verified,
        authenticationInfo: {
          id: response.authenticationInfo.credentialID,
          rpID: response.authenticationInfo.rpID,
          publicKey: webAuth.publicKey,
          attestationObject: webAuth.attestationObject,
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
      `${this.origin}/auth/callback#?email=${userAuth.email}&type=${type}&name=${userAuth.name}`,
    );
  }
}
