import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Cookies } from 'src/enums/cookie.enum';
import { ConfigService } from '@nestjs/config';
import { isDev } from 'src/config/app.config';
import { IS_NO_APP_GUARD_KEY } from 'src/decorators/external.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    private config: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isNoAppGuard = this.reflector.getAllAndOverride<boolean>(
        IS_NO_APP_GUARD_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (isNoAppGuard) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const token = this.extractAppKey(request);
      if (!token) {
        throw new UnauthorizedException();
      }

      const isValid = token == this.config.get<string>('app.id');

      if (!isValid) {
        throw new UnauthorizedException();
      }
      return true;
    } catch (error: any) {
      throw new ForbiddenException(error.message || 'Invalid app credentials');
    }
  }

  private extractAppKey(request: Request): string | undefined {
    const appKey = request.headers[Cookies.APP_KEY];
    if (!appKey) {
      throw new UnauthorizedException();
    }
    return appKey ? appKey.toString() : undefined;
  }
}
