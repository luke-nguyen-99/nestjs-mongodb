import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiConsumesFromData } from 'src/shared';
import { Roles } from 'src/shared/decorator/role.decorator';
import { USER_ROLE } from '../user/user.schema';
import { CloudService } from './cloud.service';
import { multerOptions } from './multer-option';

@Controller('cloud')
@ApiTags('cloud')
export class CloudController {
  constructor(private service: CloudService) {}

  @Post('upload')
  @ApiBearerAuth()
  @Roles(USER_ROLE.ADMIN)
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
      return await this.service.uploadMultiFiles(files);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get('/:id')
  @ApiBearerAuth()
  @Roles(USER_ROLE.ADMIN)
  async removeFile(@Param('id') id: string) {
    try {
      return await this.service.removeFile(id);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
