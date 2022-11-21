import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PRODUCT_MODEL_NAME } from '../constant';
import { ProductSchema } from './product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PRODUCT_MODEL_NAME,
        schema: ProductSchema,
      },
    ]),
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
