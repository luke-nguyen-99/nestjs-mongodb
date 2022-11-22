import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CATEGORY_MODEL_NAME } from '../constant';
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
    ]),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
