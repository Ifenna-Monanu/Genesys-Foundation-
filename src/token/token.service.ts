import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenModel } from './token.schema';
import { FilterQuery } from 'mongoose';

@Injectable()
export class TokenService {
    constructor(
        @InjectModel(Token.name) private tokenModel: TokenModel
    ){}

    async createToken(tokenDetails: Token): Promise<Token | null> {
        const newToken = new this.tokenModel(tokenDetails);
        const saved = await newToken.save();
        if(!saved){
            throw new BadRequestException('unable to create token')
        }
        return saved;
    }

    async getToken (filter: FilterQuery<Token>){
        const result = await this.tokenModel.findOne(filter);
        return result
    }
      
    async  updateTokenParams(tokenDetails: object, value: object) {
        return await this.tokenModel.updateOne(tokenDetails, value, {
          new: true,
        });
      }
      
}