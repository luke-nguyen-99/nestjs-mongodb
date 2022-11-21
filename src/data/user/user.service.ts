import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashedPassword } from 'src/shared';
import { USER_MESSAGE, USER_MODEL_NAME } from '../constant';
import { UserDto } from './user.dto';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL_NAME)
    private model: Model<User & Document>,
  ) {}

  async getAll() {
    return this.model.find().lean().exec();
  }

  async getOne(id: string) {
    return this.model.findOne({ _id: id }).lean().exec();
  }

  async create(input: UserDto) {
    const { username, full_name, email, password, role, phone } = input;

    if (!username || !password)
      throw new BadRequestException(USER_MESSAGE.EXISTS);

    const usernameExist = await this.model.findOne({ username }).lean();
    if (!!usernameExist) throw new BadRequestException(USER_MESSAGE.EXISTS);
    const hashedPass = await hashedPassword(password);
    return this.model.insertMany([
      { username, full_name, email, password: hashedPass, role, phone },
    ]);
  }

  async update(id: string, input: UserDto) {
    const user = await this.model.findOne({ _id: id }).lean();
    if (!user) throw new BadRequestException(USER_MESSAGE.NOT_FOUND);

    const { username, full_name, email, password, role, phone } = input;

    const newRecord = {};
    if (!!username && username != user.username) {
      const checkUsername = await this.model.findOne({ username }).lean();
      if (!!checkUsername) throw new BadRequestException(USER_MESSAGE.EXISTS);
      newRecord['username'] = username;
    }
    if (!!full_name && full_name != user.full_name)
      newRecord['full_name'] = full_name;
    if (!!email && email != user.email) newRecord['email'] = email;
    if (!!role && role != user.role) newRecord['role'] = role;
    if (!!phone && phone != user.phone) newRecord['phone'] = phone;
    if (!!password) newRecord['password'] = await hashedPassword(password);

    return this.model.updateOne({ _id: id }, newRecord).exec();
  }

  async delete(id: string) {
    const user = await this.model.findOne({ _id: id }).lean();
    if (!user) throw new BadRequestException(USER_MESSAGE.NOT_FOUND);
    return this.model.deleteOne({ _id: id }).exec();
  }
}
