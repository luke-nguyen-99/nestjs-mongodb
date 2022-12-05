import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { CloudModule } from './cloud/cloud.module';
import { DriveModule } from './drive/drive.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    ProductModule,
    CategoryModule,
    DriveModule,
    CloudModule,
  ],
})
export class DataModule {}
