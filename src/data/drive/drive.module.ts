import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DRIVE_MODEL_NAME } from '../constant';
import { DriveController } from './drive.controller';
import { DriveSchema } from './drive.schema';
import { DriveService } from './drive.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DRIVE_MODEL_NAME,
        schema: DriveSchema,
      },
    ]),
  ],
  providers: [DriveService],
  controllers: [DriveController],
  exports: [DriveService],
})
export class DriveModule {}
