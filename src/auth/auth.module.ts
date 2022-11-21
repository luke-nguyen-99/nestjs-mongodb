import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_AUTH } from 'src/shared';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { USER_MODEL_NAME } from 'src/data/constant';
import { UserSchema } from 'src/data/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: USER_MODEL_NAME,
        schema: UserSchema,
      },
    ]),
    JwtModule.register({
      secret: JWT_AUTH.SESSION_KEY,
      signOptions: {
        expiresIn: JWT_AUTH.EXPIRES_IN,
        algorithm: 'HS512',
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
