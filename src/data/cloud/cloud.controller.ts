import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiConsumesFromData } from 'src/shared';
import { Public } from 'src/shared/decorator/public.decorator';
import { multerOptions } from '../drive/multer-option';
import { CloudService } from './cloud.service';

@Controller('imagekit')
@ApiTags('imagekit')
export class CloudController {
  constructor(private service: CloudService) {}

  @Post('upload')
  @Public()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiConsumes(ApiConsumesFromData)
  @UseInterceptors(AnyFilesInterceptor(multerOptions))
  async upload(@UploadedFiles() files: Array<Express.Multer.File>) {
    try {
      return await this.service.uploadMultipleFiles(files);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
