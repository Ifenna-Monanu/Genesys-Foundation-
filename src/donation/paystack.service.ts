import { ConfigService } from '@nestjs/config';
import { PaystackDTO } from './donation.dto';
import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';

@Injectable()
export class PaystackService {
  constructor(private configService: ConfigService) {}

  getVariables() {
    return {
      baseURL: this.configService.get('paystack.baseURL'),
      secret: this.configService.get('paystack.secretKey')
    };
  }

  async instantiatePayment(paystackDTO: PaystackDTO) {
    const { amount, email, fullname, txId } = paystackDTO;
    const paymentParams = {
      amount: amount * 100,
      email: email,
      metadata: {
        txId: txId,
        fullname: fullname
      }
    };
    const result = await axios.post(
      `${this.getVariables().baseURL}/transaction/initialize`,
      paymentParams,
      {
        headers: {
          Authorization: `Bearer ${this.getVariables().secret}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return result;
  };

  async constructPaystackHash (paystackBody: string) {
    const hash = createHmac('sha512', this.getVariables().secret)
    .update(paystackBody)
    .digest('hex');
    return hash;
  }

}
