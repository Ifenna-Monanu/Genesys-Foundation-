import mongoose, { Document, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

type UserStatistics = {
    hashPassword(password: string): Promise<string>;
    userExists(email:string): Promise<boolean>
  }
  
  type UserMethods = {
    comparePassword(password: string): Promise<boolean>;
  }

  
  
@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
        }
    }
})

export class User {
    @Prop({ unique: true, required: true, trim: true })
    email: string;

    @Prop({required: true})
    password: string;

    @Prop({
      default: null
    })
    firstName:string;

    @Prop({
      default: null
    })
    country:string;

    @Prop({
      default: null
    })
    businessName: string;

    @Prop({
      default: null
    })
    businessEmail: string

    @Prop({
      default: null
    })
    lastName: string;



    @Prop({
      default: false
    }) 
    emailVerified: boolean;
}

export const userSchema = SchemaFactory.createForClass(User);
const userModel =  mongoose.model('User', userSchema)

userSchema.methods.comparePassword = async function compare(password: string) {
    return bcrypt.compare(password, this.password);
  };
  

userSchema.statics.hashPassword = async function hashPassword(
    password: string
  ) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  };
  

userSchema.statics.userExists = async function duplicateIdentity (
    email: string
) {
    const user = await userModel.findOne({
        email
    });
    console.log(user)
    if(user) return true;
    return false
}

  
userSchema.pre('save', async function preSave(next) {
    if (this.isModified('password') || (this.isNew && this.password)) {
      const saltOrRounds = 10;
      this.password = await bcrypt.hash(this.password, saltOrRounds);
    }
    next();
  });
  
  export type UserDocument = User & Document & UserMethods;
  
  export type UserModel = Model<UserDocument> & UserStatistics;