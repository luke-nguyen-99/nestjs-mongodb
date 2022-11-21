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
import { Roles } from 'src/shared/decorater/role.decorator';
import { UserDto } from './user.dto';
import { USER_ROLE } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
@Roles(USER_ROLE.ADMIN)
export class UserController {
  constructor(private service: UserService) {}

  @Get()
  async getAll() {
    try {
      return this.service.getAll();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get('/:id')
  async getOne(@Param('id') id: string) {
    try {
      return this.service.getOne(id);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('create')
  @ApiConsumes(ApiConsumesFromUrl)
  async create(@Body() input: UserDto) {
    try {
      return this.service.create(input);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Put('update/:id')
  @ApiConsumes(ApiConsumesFromUrl)
  async update(@Param('id') id: string, @Body() input: UserDto) {
    try {
      return this.service.update(id, input);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    try {
      return this.service.delete(id);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
