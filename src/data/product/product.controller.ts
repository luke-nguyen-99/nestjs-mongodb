import { ApiConsumesFromData } from './../../shared/index';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiConsumesFromUrl } from 'src/shared';
import { Public } from 'src/shared/decorator/public.decorator';
import { Roles } from 'src/shared/decorator/role.decorator';
import { multerOptions } from '../drive/multer-option';
import { USER_ROLE } from '../user/user.schema';
import { ProductDto, QueryFilter, SetCategoriesDto } from './product.dto';
import { ProductService } from './product.service';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private service: ProductService) {}

  @Get()
  @Public()
  async getAll(@Query() query: QueryFilter) {
    try {
      return await this.service.getAll(query);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Get('/:slug')
  @Public()
  async getOne(@Param('slug') slug: string) {
    try {
      return await this.service.getOneAndPopulate({ slug });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Roles(USER_ROLE.ADMIN)
  @Post('create')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        detail: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              size: { type: 'string' },
              price: { type: 'number' },
            },
          },
        },
        description: { type: 'string' },
        amount: { type: 'number' },
        category: { type: 'string' },
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
  @ApiBearerAuth()
  @UseInterceptors(AnyFilesInterceptor(multerOptions))
  async create(
    @Body() input: ProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    try {
      return await this.service.create(input, files);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Put('update/:slug')
  @ApiConsumes(ApiConsumesFromData)
  @Roles(USER_ROLE.ADMIN)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        detail: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              size: { type: 'string' },
              price: { type: 'number' },
            },
          },
        },
        description: { type: 'string' },
        amount: { type: 'number' },
        category: { type: 'string' },
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
  @UseInterceptors(AnyFilesInterceptor(multerOptions))
  async update(
    @Param('slug') slug: string,
    @Body() input: ProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    try {
      return await this.service.update(slug, input, files);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Patch('set-categories/:slug')
  @ApiConsumes(ApiConsumesFromUrl)
  @Roles(USER_ROLE.ADMIN)
  @ApiBearerAuth()
  async setCategories(
    @Param('slug') slug: string,
    @Body() input: SetCategoriesDto,
  ) {
    try {
      return await this.service.setCategories(slug, input);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Delete('delete/:slug')
  @Roles(USER_ROLE.ADMIN)
  @ApiBearerAuth()
  async delete(@Param('slug') slug: string) {
    try {
      return await this.service.delete(slug);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
