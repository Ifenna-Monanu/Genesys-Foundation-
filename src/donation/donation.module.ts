import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Donation, DonationSchema } from './donation.schema';
import { DonationService } from './donation.service';
import { DonationController } from './donation.controller';
import { PaystackService } from './paystack.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Donation.name,
        schema: DonationSchema
      }
    ])
  ],
  providers: [DonationService, PaystackService],
  controllers: [DonationController]
})
export class DonationModule {}
