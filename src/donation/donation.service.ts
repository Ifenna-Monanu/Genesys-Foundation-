import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Donation, DonationModel, DonationStatus } from './donation.schema';
import { FilterQuery, UpdateQuery } from 'mongoose';

@Injectable()
export class DonationService {
  constructor(
    @InjectModel(Donation.name) private donationModel: DonationModel
  ) {}

  async createDonation(createDonationDto: Partial<Donation>) {
    const newDonation = new this.donationModel(createDonationDto);
    const saved = await newDonation.save();
    if (!saved) {
      throw new BadRequestException('unable to create donation');
    }
    return saved;
  }

  async findOneDonation(filter: FilterQuery<Donation>) {
    const result = await this.donationModel.findOne(filter);
    if (!result) {
      throw new BadRequestException('Unable to find donation');
    }
    return result;
  }

  async updateDonationStatus(filter: FilterQuery<Donation>, updateValue: UpdateQuery<Donation>){
    const result = await this.donationModel.findOneAndUpdate(filter, updateValue, {
      new: true
    });
    if(!result) {
      throw new BadRequestException('Unable to updated donation');
    }
    return result;
  }

  async getAllDonations () {
    const donations = await this.donationModel.find({paymentStatus: DonationStatus.SUCCESSFUL});
    if(!donations) {
      throw new BadRequestException('Unable to get donations');
    }
    return donations
  }
}
