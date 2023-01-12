import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { CloudModule } from './cloud/cloud.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, ProductModule, CategoryModule, CloudModule],
})
export class DataModule {}
