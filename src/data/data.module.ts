import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { DriveModule } from './drive/drive.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, ProductModule, CategoryModule, DriveModule],
})
export class DataModule {}
