import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CATEGORY_MODEL_NAME } from '../constant';

@Schema({
  timestamps: true,
  collection: CATEGORY_MODEL_NAME,
})
export class Category {
  @Prop()
  name: string;
  @Prop()
  slug: string;
}

export interface DetailProduct {
  size: string;
  price: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
