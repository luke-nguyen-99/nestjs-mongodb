import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { USER_MESSAGE, USER_MODEL_NAME } from 'src/data/constant';
import { User } from 'src/data/user/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './auth.dto';
import { AUTH_MESSAGE, checkIsMatchPassword } from 'src/shared';
import { PayloadTokenUser } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(USER_MODEL_NAME)
    private userModel: Model<User & Document>,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: SignInDto) {
    const { username, password } = dto;
    if (!username || !password)
      throw new BadRequestException(USER_MESSAGE.NOT_NULL);
    const user = await this.userModel
      .findOne({ username })
      .select('_id username role full_name email phone password')
      .lean()
      .exec();

    if (!user) {
      throw new BadRequestException(AUTH_MESSAGE.WRONG);
    }

    const isMatch = await checkIsMatchPassword(dto.password, user.password);

    if (!!isMatch) return this.genJwtToken(user);
    throw new BadRequestException(AUTH_MESSAGE.WRONG);
  }

  async genJwtToken(user) {
    const { _id, username, role, full_name, email, phone } = user;
    const payload: PayloadTokenUser = {
      id: _id,
      email,
      username,
      phone,
      role,
      full_name,
    };
    return this.jwtService.sign(payload);
  }

  async getProfile(user: PayloadTokenUser) {
    const userRecord = await this.userModel
      .findOne({
        _id: user.id,
      })
      .lean()
      .exec();

    if (!userRecord) throw new BadRequestException(AUTH_MESSAGE.NOT_FOUND);

    return userRecord;
  }
}
