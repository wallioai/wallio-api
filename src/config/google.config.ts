import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
  clientId: process.env.AUTH_GOOGLE_ID,
  clientSecret: process.env.AUTH_GOOGLE_SECRET,
  callbackUrl: process.env.AUTH_GOOGLE_CALLBACK,
}));
