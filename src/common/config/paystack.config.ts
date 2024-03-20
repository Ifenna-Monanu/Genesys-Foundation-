import { registerAs } from '@nestjs/config';

export default registerAs('paystack', () => ({
  baseURL: 'https://api.paystack.co',
  secretKey: process.env.PAYSTACK_SECRET_KEY
}));