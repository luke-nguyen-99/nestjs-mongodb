import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiConsumesFromUrl } from 'src/shared';
import { Public } from 'src/shared/decorater/public.decorator';
import { Roles } from 'src/shared/decorater/role.decorator';
import { USER_ROLE } from '../user/user.schema';
import { CategoryDto } from './category.dto';
import { CategoryService } from './category.service';

@Controller('category')
@ApiTags('category')
export class CategoryController {
  constructor(private service: CategoryService) {}

  @Public()
  @Get()
  async getAll() {
    try {
      return await this.service.getAll();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Public()
  @Get('/:slug')
  async getOne(@Param('slug') slug: string) {
    try {
      return await this.service.getOneByCondition({ slug });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Roles(USER_ROLE.ADMIN)
  @Post('create')
  @ApiBearerAuth()
  @ApiConsumes(ApiConsumesFromUrl)
  async create(@Body() input: CategoryDto) {
    try {
      return await this.service.create(input);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Roles(USER_ROLE.ADMIN)
  @Put('update/:slug')
  @ApiBearerAuth()
  @ApiConsumes(ApiConsumesFromUrl)
  async update(@Param('slug') slug: string, @Body() input: CategoryDto) {
    try {
      return await this.service.update(slug, input);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Roles(USER_ROLE.ADMIN)
  @Delete('delete/:slug')
  @ApiBearerAuth()
  async delete(@Param('slug') slug: string) {
    try {
      return await this.service.delete(slug);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
