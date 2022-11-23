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
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiConsumesFromUrl } from 'src/shared';
import { Public } from 'src/shared/decorater/public.decorator';
import { Roles } from 'src/shared/decorater/role.decorator';
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
  @ApiConsumes(ApiConsumesFromUrl)
  @ApiBearerAuth()
  async create(@Body() input: ProductDto) {
    try {
      return await this.service.create(input);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Put('update/:slug')
  @ApiConsumes(ApiConsumesFromUrl)
  @Roles(USER_ROLE.ADMIN)
  @ApiBearerAuth()
  async update(@Param('slug') slug: string, @Body() input: ProductDto) {
    try {
      return await this.service.update(slug, input);
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
