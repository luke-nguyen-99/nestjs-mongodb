import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { USER_MODEL_NAME } from 'src/data/constant';
import { UserSchema } from 'src/data/user/user.schema';
import { AuthenticationGuard } from './guard/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: USER_MODEL_NAME,
        schema: UserSchema,
      },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AuthenticationGuard],
  exports: [MongooseModule],
})
export class SharedModule {}
