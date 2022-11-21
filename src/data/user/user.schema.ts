import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { USER_MODEL_NAME } from '../constant';

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  MOD = 'MOD',
  USER = 'USER',
}

@Schema({
  timestamps: true,
  collection: USER_MODEL_NAME,
})
export class User {
  @Prop({ unique: true })
  username: string;
  @Prop()
  full_name: string;
  @Prop()
  email: string;
  @Prop({ select: false })
  password: string;
  @Prop({ default: USER_ROLE.USER })
  role: string;
  @Prop()
  phone: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
