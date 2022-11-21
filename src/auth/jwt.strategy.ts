import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { USER_MODEL_NAME } from 'src/data/constant';
import { User } from 'src/data/user/user.schema';
import { AUTH_MESSAGE, JWT_AUTH } from 'src/shared';
import { Model } from 'mongoose';

export interface PayloadTokenUser {
  id?: string;
  username?: string;
  full_name?: string;
  role?: string;
  email?: string;
  phone?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectModel(USER_MODEL_NAME)
    private userModel: Model<User & Document>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_AUTH.SESSION_KEY,
      algorithm: JWT_AUTH.ALGORITHM,
    });
  }

  async validate(payload: { id: string }): Promise<PayloadTokenUser> {
    const user = await this.userModel
      .findOne({ _id: payload.id })
      .lean()
      .exec();

    if (!user) {
      throw new BadRequestException(AUTH_MESSAGE.UNAUTHORIZED);
    }

    return {
      id: user._id.toString(),
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      email: user.email,
      phone: user.phone,
    };
  }
}
