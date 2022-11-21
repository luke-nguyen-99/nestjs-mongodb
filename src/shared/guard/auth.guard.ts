import {
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Model } from 'mongoose';
import { USER_MODEL_NAME } from 'src/data/constant';
import { User } from 'src/data/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { AUTH_MESSAGE } from '..';

@Injectable()
export class AuthenticationGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(USER_MODEL_NAME)
    private userModel: Model<User & Document>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      'public',
      context.getHandler(),
    );
    if (!!isPublic) return true;

    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      throw new BadRequestException(AUTH_MESSAGE.UNAUTHORIZED);
    }

    const roles = this.reflector.getAllAndOverride<string[]>('rolesCheck', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userActive = request.user;
    const user = await this.userModel
      .findOne({ _id: userActive.id })
      .lean()
      .exec();
    if (!!user) {
      if (roles.indexOf(user.role) < 0)
        throw new ForbiddenException(AUTH_MESSAGE.ROLE);
    }

    return true;
  }
}
