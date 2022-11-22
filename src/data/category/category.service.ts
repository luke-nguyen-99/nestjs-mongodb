import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { changeToSlug } from 'src/shared';
import { CATEGORY_MESSAGE, CATEGORY_MODEL_NAME } from '../constant';
import { CategoryDto } from './category.dto';
import { Category } from './category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CATEGORY_MODEL_NAME)
    private model: Model<Category & Document>,
  ) {}

  async getAll() {
    return this.model.find().lean();
  }

  async getOneByCondition(condition) {
    return this.model.findOne(condition).lean();
  }

  async create(input: CategoryDto) {
    const nameExists = await this.getOneByCondition({ name: input.name });
    if (!!nameExists) throw new BadRequestException(CATEGORY_MESSAGE.EXISTS);
    let slug = changeToSlug(input.name);
    const slugExists = await this.getOneByCondition({ slug });
    if (!!slugExists) slug = changeToSlug(input.name, new Date());
    return this.model.create({ name: input.name, slug });
  }

  async update(slug: string, input: CategoryDto) {
    const category = await this.getOneByCondition({ slug });
    if (!category) throw new BadRequestException(CATEGORY_MESSAGE.NOT_FOUND);
    if (!!input.name && input.name != category.name)
      await this.model
        .updateOne({ _id: category._id }, { name: input.name })
        .exec();
    return this.getOneByCondition({ _id: category._id });
  }

  async delete(slug: string) {
    const category = await this.getOneByCondition({ slug });
    if (!category) throw new BadRequestException(CATEGORY_MESSAGE.NOT_FOUND);
    return this.model.deleteOne({ _id: category._id }).exec();
  }
}
