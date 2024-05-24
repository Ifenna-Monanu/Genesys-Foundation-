import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from './user.schema';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { RegisterDTO } from 'src/auth/auth.dto';

@Injectable()
export class UsersService {
  constructor (
    @InjectModel(User.name) private userModel: UserModel
  ) {}

 async create(createUserDto: RegisterDTO) {
    const newUser = new this.userModel(createUserDto);
    const savedUser = await newUser.save();
    if(!savedUser) {
      throw new BadRequestException('unable to create user')
    }
    return savedUser
  }

  async userExists (email:string) {
    const userExists = await this.userModel.userExists(email);
    return userExists
  }

  async findAll() {
    const users = await this.userModel.find();
    if(users){
      throw new BadRequestException('unable to fetch users');
    }
    return users;
  }

  async findOne(filter: FilterQuery<User>) {
    const user = await this.userModel.findOne(filter);
    return user
  }

  async update(filter: FilterQuery<User>, updateUserDto: UpdateQuery<User>) {
    const result = await this.userModel.findOneAndUpdate(filter, updateUserDto, {
      new: true
    });
    if(!result){
      throw new BadRequestException('unable to update user info')
    }
    return result
    }

  async remove(filter: FilterQuery<User>) {
    const result = await this.userModel.findOneAndDelete(filter);
    if(!result){
      throw new BadRequestException('unable to delete user info')
    }
    return result

  }
}