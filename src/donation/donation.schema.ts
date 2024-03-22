import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import  { Document, Model } from 'mongoose';

export enum PaymentType {
  ONE_TIME = 'ONE_TIME',
  RECURRING = 'RECURRING'
}

export enum DonationStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SUCCESSFUL = 'SUCCESSFUL'
}

@Schema({
  timestamps: true
})
export class Donation {
  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true })
  amount: number;

  @Prop({required: false})
  initiative?: string

  @Prop({ required: true })
  txId: string;

  @Prop({
    enum: PaymentType,
    default: PaymentType.ONE_TIME
  })
  paymentType: PaymentType;

  @Prop({
    enum: DonationStatus,
    default: DonationStatus.PENDING
  })
  paymentStatus: DonationStatus;
}

export const DonationSchema = SchemaFactory.createForClass(Donation);

export type DonationDocument = Donation & Document;
export type DonationModel = Model<DonationDocument>;
