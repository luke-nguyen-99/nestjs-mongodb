import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BaseCRUDService } from './base.service';
export class BaseController<T, I> {
  constructor(protected service: BaseCRUDService<T, I>) {}

  @Get()
  async getAll(): Promise<T[]> {
    return this.service.findAll();
  }

  @Get('/:id')
  async getOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post('create')
  async create(@Body() input: I) {
    return this.service.create(input);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() input: I) {
    return this.service.update(id, input);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
