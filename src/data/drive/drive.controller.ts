import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorator/public.decorator';
import { Roles } from 'src/shared/decorator/role.decorator';
import { USER_ROLE } from '../user/user.schema';
import { DriveService } from './drive.service';
import { multerOptions } from './multer-option';

@Controller('drive')
@ApiTags('drive')
@ApiBearerAuth()
@Roles(USER_ROLE.ADMIN)
export class DriveController {
  constructor(private service: DriveService) {}
  @Post('upload')
  @Public()
  @UseInterceptors(AnyFilesInterceptor(multerOptions()))
  async upload(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.service.uploadMultiFiles(files);
  }
}
