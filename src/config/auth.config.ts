import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtKey: process.env.JWT_CONSTANT,
  expiresIn: process.env.JWT_EXPIRE_IN,
  encryptionKey: process.env.ENCRYPTION_KEY,
}));
