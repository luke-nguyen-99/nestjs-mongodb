import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DRIVE_MODEL_NAME } from '../constant';

@Schema({
  timestamps: true,
  collection: DRIVE_MODEL_NAME,
})
export class Drive {
  @Prop()
  url: string;
  @Prop()
  background: boolean;
}
export const DriveSchema = SchemaFactory.createForClass(Drive);
