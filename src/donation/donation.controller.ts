import { BadRequestException, Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { DonationService } from './donation.service';
import { ErrorResponseDTO } from 'src/common/dtos/response.dto';
import { OneTimeDonationDTO } from './donation.dto';
import { PaystackService } from './paystack.service';
import { randomToken } from 'src/util/random.util';
import { Request, Response } from 'express';
import crypto from 'crypto';
import { Donation, DonationStatus } from './donation.schema';

@Controller('donation')
@ApiTags('donation')
export class DonationController {
  constructor(
    private donationService: DonationService,
    private paystackService: PaystackService,

  ) {}

  @Post('/one-time')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Endpoint for making one time payment' })
  @ApiOkResponse({
    description: 'Initiated one-time donation successfully',
    type: OneTimeDonationDTO
  })
  @ApiBadRequestResponse({
    description: 'Credentials is invalid',
    type: ErrorResponseDTO
  })
  async oneTimeDonation(@Body() donation: OneTimeDonationDTO) {
    const token = randomToken();
    const paymentInit = await this.paystackService.instantiatePayment({
      email: donation.email,
      amount: donation.amount,
      fullname: donation.fullname,
      txId: token
    });
    await this.donationService.createDonation({
      email: donation.email,
      fullname: donation.fullname,
      amount: donation.amount,
      initiative: donation.initiative,
      txId: token
    });
    return { data: paymentInit.data };
  }


  @Get('/all-donations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Endpoint for getting all donations' })
  @ApiOkResponse({
    description: 'Get all donations',
    type: [OneTimeDonationDTO]
  })
  @ApiBadRequestResponse({
    description: 'Credentials is invalid',
    type: ErrorResponseDTO
  })
  async allDonations () {
    const donations = await this.donationService.getAllDonations();
    return {data: donations}
  }

  @Post('/webhook')
  @ApiOperation({ summary: 'Endpoint for verifying paystack payments' })
  async paystackWebHook (
    @Headers('x-paystack-signature') signature: string,
    @Req() request: Request,
    @Res() response: Response
  ){
    if (!signature) {
      throw new BadRequestException('Missing paystack-signature header');
    };
    const eventData = request.body;
    console.log(eventData, "event")
    const hash = await this.paystackService.constructPaystackHash(JSON.stringify(eventData));
    console.log(hash, "hash")
    if(hash == signature) {
        const txId = eventData.data.metadata.txId;
        switch(eventData.event) {
          case 'charge.success': 
            const res = await this.donationService.updateDonationStatus({txId}, {paymentStatus: DonationStatus.SUCCESSFUL}); 
            console.log(res, "res")
        }
        response.sendStatus(200)
    }
  }



}
