import { Module } from '@nestjs/common';
import { DriveController } from './drive.controller';
import { DriveService } from './drive.service';

@Module({
  imports: [],
  providers: [DriveService],
  controllers: [DriveController],
})
export class DriveModule {}
