import { SetMetadata } from '@nestjs/common';

export const IS_NO_APP_GUARD_KEY = 'isNoAppGuard';
export const NoAppGuard = () => SetMetadata(IS_NO_APP_GUARD_KEY, true);