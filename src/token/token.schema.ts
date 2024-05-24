import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import  mongoose, { Document, Model } from 'mongoose';
import { User } from 'src/users/user.schema';
import * as bcrypt from 'bcrypt';

type TokenMethods = {
    comparePassword(password: string): Promise<boolean>;
  }

export enum TOKENTYPE {
    PASSWORD_REST = 'PASSWORD_RESET',
    EMAIL_CONFIRM = 'EMAIL_CONFIRM',
  }
  
  @Schema({
    timestamps: true
  })

export class Token {
    @Prop({
        type: mongoose.Types.ObjectId,
        ref: User.name,
        required: true
    })
    userId: User;

    @Prop({
        enum: TOKENTYPE,
        default: TOKENTYPE.PASSWORD_REST,
        required: true
    })
    tokenType: string;

    @Prop({
        type: String,
        required: true,
    })
    token: string;

    @Prop({
        type: Date,
        required: true,
        expires: 60000
    })
    
    expirationDate: Date
}

export const TokenSchema = SchemaFactory.createForClass(Token);


TokenSchema.methods.comparePassword = async function compare(token: string) {
    return bcrypt.compare(token, this.token);
  };
  

TokenSchema.pre('save', async function preSave(next) {
    if(this.tokenType === TOKENTYPE.PASSWORD_REST) {
      if (this.isModified('token') || (this.isNew && this.token)) {
        const saltOrRounds = 10;
        this.token = await bcrypt.hash(this.token, saltOrRounds);
      }
    }
    next();
});

export type TokenDocument = Token & Document & TokenMethods;
export type TokenModel = Model<TokenDocument>;