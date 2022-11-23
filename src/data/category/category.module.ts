import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CATEGORY_MODEL_NAME, PRODUCT_MODEL_NAME } from '../constant';
import { ProductSchema } from '../product/product.schema';
import { CategoryController } from './category.controller';
import { CategorySchema } from './category.schema';
import { CategoryService } from './category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CATEGORY_MODEL_NAME,
        schema: CategorySchema,
      },
      {
        name: PRODUCT_MODEL_NAME,
        schema: ProductSchema,
      },
    ]),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
