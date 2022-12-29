import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CLOUD_MODEL_NAME } from '../constant';
import { CloudController } from './cloud.controller';
import { CloudSchema } from './cloud.schema';
import { CloudService } from './cloud.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CLOUD_MODEL_NAME,
        schema: CloudSchema,
      },
    ]),
    // ImageKitModule
  ],
  providers: [CloudService],
  controllers: [CloudController],
})
export class CloudModule {}
