import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CATEGORY_MODEL_NAME, PRODUCT_MODEL_NAME } from '../constant';
import { ProductSchema } from './product.schema';
import { CategorySchema } from '../category/category.schema';
import { CloudModule } from '../cloud/cloud.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PRODUCT_MODEL_NAME,
        schema: ProductSchema,
      },
      {
        name: CATEGORY_MODEL_NAME,
        schema: CategorySchema,
      },
    ]),
    CloudModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
