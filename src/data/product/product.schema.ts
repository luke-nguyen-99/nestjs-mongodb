import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PRODUCT_MODEL_NAME } from '../constant';

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
  images: string[];
}

export interface DetailProduct {
  size: string;
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
