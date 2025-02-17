import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: Model<User>) {}
  create(createUserDto: Partial<User>) {
    return this.model.create(createUserDto);
  }

  findAll(filter?: FilterQuery<User>) {
    return this.model.find(filter);
  }

  findOne(filter: FilterQuery<User>) {
    return this.model.findOne(filter);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
