import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME,
  id: process.env.APP_ID,
  hostname: process.env.HOSTNAME,
  db: process.env.MONGO_DB_URI,
  origin: process.env.ORIGIN,
  coingecko: process.env.COINGECKO_KEY,
}));

export const isDev = process.env.NODE_ENV === 'development';
console.log(`isDev ${isDev}`);

