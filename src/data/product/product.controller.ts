import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiConsumesFromUrl } from 'src/shared';
import { Public } from 'src/shared/decorater/public.decorator';
import { Roles } from 'src/shared/decorater/role.decorator';
import { USER_ROLE } from '../user/user.schema';
import { ProductDto, QueryFilter } from './product.dto';
import { ProductService } from './product.service';

@Controller('product')
@ApiTags('controller')
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
  @Get('/:id')
  @Public()
  async getOne(@Param('id') id: string) {
    try {
      return await this.service.getOne(id);
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

  @Put('update/:id')
  @ApiConsumes(ApiConsumesFromUrl)
  @Roles(USER_ROLE.ADMIN)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() input: ProductDto) {
    try {
      return await this.service.update(id, input);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Delete('delete/:id')
  @Roles(USER_ROLE.ADMIN)
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    try {
      return await this.service.delete(id);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
