import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Donation, DonationModel } from './donation.schema';
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
    const result = await this.donationModel.findByIdAndUpdate({filter, updateValue });
    if(!result) {
      throw new BadRequestException('Unable to updated donation');
    }
    return result;
  }
}
