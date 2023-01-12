import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CATEGORY_MODEL_NAME, PRODUCT_MODEL_NAME } from '../constant';

@Schema({
  timestamps: true,
  collection: PRODUCT_MODEL_NAME,
})
export class Product {
  @Prop()
  name: string;
  @Prop()
  readonly detail: DetailProduct[];
  @Prop()
  description: string;
  @Prop()
  slug: string;
  @Prop()
  amount: number;
  @Prop()
  sale: number;
  @Prop()
  images: string[];
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: CATEGORY_MODEL_NAME,
  })
  categories: string[];
}

export interface DetailProduct {
  size: string;
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
