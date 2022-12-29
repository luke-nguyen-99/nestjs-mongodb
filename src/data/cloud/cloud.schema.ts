import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CLOUD_MODEL_NAME } from '../constant';

@Schema({
  timestamps: true,
  collection: CLOUD_MODEL_NAME,
})
export class Cloud {
  @Prop()
  file_id: string;
  @Prop()
  url: string;
  @Prop()
  background: boolean;
}
export const CloudSchema = SchemaFactory.createForClass(Cloud);
