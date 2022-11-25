import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { changeToSlug } from 'src/shared';
import { Category } from '../category/category.schema';
import {
  CATEGORY_MESSAGE,
  CATEGORY_MODEL_NAME,
  DRIVE_MODEL_NAME,
  PRODUCT_MESSAGE,
  PRODUCT_MODEL_NAME,
} from '../constant';
import { DriveService } from '../drive/drive.service';
import { ProductDto, QueryFilter, SetCategoriesDto } from './product.dto';
import { Product } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(PRODUCT_MODEL_NAME)
    private model: Model<Product & Document>,
    @InjectModel(CATEGORY_MODEL_NAME)
    private categoryModel: Model<Category & Document>,

    private driveService: DriveService,
  ) {}

  async getAll(filter: QueryFilter) {
    const {
      limit,
      offset,
      keyword,
      size,
      minPrice,
      maxPrice,
      price,
      name,
      category,
      sortPrice,
      sortCreatedAt,
      sortUpdatedAt,
      sortAmount,
    } = filter;
    const queryFilter = [];
    queryFilter.push(
      {
        $lookup: {
          from: CATEGORY_MODEL_NAME,
          localField: 'categories',
          foreignField: '_id',
          as: 'categories',
        },
      },
      {
        $lookup: {
          from: DRIVE_MODEL_NAME,
          localField: 'images',
          foreignField: '_id',
          as: 'images',
        },
      },
    );

    if (!!size) queryFilter.push({ $match: { 'detail.size': { $eq: size } } });
    if (!!price) queryFilter.push({ $match: { 'detail.price': +price } });
    if (!!minPrice)
      queryFilter.push({ $match: { 'detail.price': { $gte: +minPrice } } });
    if (!!maxPrice)
      queryFilter.push({ $match: { 'detail.price': { $lte: +maxPrice } } });
    if (!!name) queryFilter.push({ $match: { name: { $eq: name } } });

    if (!!keyword)
      queryFilter.push(
        ...[
          {
            $addFields: {
              fieldFilter: {
                $function: {
                  body: function (a, b, c, d) {
                    let result = '';
                    if (!!a) result += a;
                    if (!!b) result += b;
                    if (!!c) result += c;
                    if (!!d) result += d;
                    return result;
                  },
                  args: [
                    '$name',
                    '$description',
                    '$detail.size',
                    '$detail.price',
                  ],
                  lang: 'js',
                },
              },
            },
          },
          {
            $addFields: {
              result: {
                $regexMatch: {
                  input: '$fieldFilter',
                  regex: `${keyword}`,
                  options: 'i',
                },
              },
            },
          },
          {
            $match: { result: true },
          },
        ],
      );

    if (!!sortPrice && sortPrice == 'true') {
      queryFilter.push({ $sort: { 'detail.price': -1 } });
    } else if (!!sortPrice && sortPrice == 'false') {
      queryFilter.push({ $sort: { 'detail.price': 1 } });
    }
    if (!!sortCreatedAt && sortCreatedAt == 'true') {
      queryFilter.push({ $sort: { createdAt: 1 } });
    } else if (!!sortCreatedAt && sortCreatedAt == 'false') {
      queryFilter.push({ $sort: { createdAt: -1 } });
    }
    if (!!sortUpdatedAt && sortUpdatedAt == 'true') {
      queryFilter.push({ $sort: { updatedAt: -1 } });
    } else if (!!sortUpdatedAt && sortUpdatedAt == 'false') {
      queryFilter.push({ $sort: { updatedAt: 1 } });
    }

    if (!!category) {
      const categories = category.split(',');
      queryFilter.push(
        ...[
          {
            $addFields: {
              filterCategory: {
                $function: {
                  body: function (arr, filter) {
                    const checked = filter.filter(
                      (e) => !!arr.find((i) => i.slug == e),
                    );

                    if (!!checked && checked.length == filter.length)
                      return true;
                  },
                  args: ['$category', categories],
                  lang: 'js',
                },
              },
            },
          },
          {
            $match: { filterCategory: true },
          },
        ],
      );
    }

    if (!!sortAmount && sortAmount == 'true') {
      queryFilter.push({ $sort: { amount: -1 } });
    } else if (!!sortAmount && sortAmount == 'false') {
      queryFilter.push({ $sort: { amount: 1 } });
    }

    const allData = await this.model
      .aggregate([
        ...queryFilter,
        {
          $group: { _id: '', total: { $sum: 1 } },
        },
      ])
      .exec();

    queryFilter.push({ $limit: !!limit ? +limit : 9 });
    queryFilter.push({ $skip: !!offset ? +offset : 0 });
    const data = await this.model.aggregate(queryFilter).exec();
    return { total: allData[0]?.total, data };
  }

  async getOneByCondition(condition) {
    return this.model.findOne(condition).lean();
  }

  async getCategoryBySlugs(slugs: string[]) {
    return this.categoryModel.find({ slug: { $in: slugs } }).lean();
  }

  async create(input: ProductDto, files: Array<Express.Multer.File>) {
    const { name, detail, description, amount, category } = input;
    if (!name) throw new BadRequestException(PRODUCT_MESSAGE.NAME_NOT_NULL);
    const listImageId = [];
    if (!!files && files.length > 0) {
      (await this.driveService.uploadMultiFiles(files)).forEach((e) => {
        listImageId.push(e['_id']);
      });
    }

    if (!detail || detail.length == 0)
      throw new BadRequestException(PRODUCT_MESSAGE.SIZE_NOT_NULL);
    const listDetail = detail.split('},');
    const details = listDetail.map((e, index) => {
      let item = e;
      if (index < listDetail.length - 1) {
        item = e + '}';
      }
      return JSON.parse(item);
    });

    let slug = changeToSlug(name);
    const slugExist = await this.getOneByCondition({ slug });
    if (!!slugExist) slug = changeToSlug(name, new Date());

    const listCategoryId = [];
    if (!!category) {
      const categories = category.split(',');
      const listCategory = await this.getCategoryBySlugs(categories);
      if (!listCategory || listCategory.length < 1)
        throw new BadRequestException(CATEGORY_MESSAGE.NOT_FOUND);

      listCategory.forEach((category) => {
        listCategoryId.push(category?._id);
      });
    }
    await this.model.insertMany([
      {
        name,
        detail: details,
        description,
        images: listImageId,
        slug,
        amount: !!amount || amount == 0 ? +amount : null,
        categories: listCategoryId,
      },
    ]);
    return this.getOneAndPopulate({ slug });
  }

  async update(
    slug: string,
    input: ProductDto,
    files: Array<Express.Multer.File>,
  ) {
    const product = await this.getOneByCondition({ slug });
    if (!product) throw new BadRequestException(PRODUCT_MESSAGE.NOT_FOUND);
    const { name, detail, description, amount, category } = input;
    const newRecord = {};
    if (!!name && name != product.name) newRecord['name'] = name;
    if (!!description && description != product.description)
      newRecord['description'] = description;
    if (!!files && files.length > 0) {
      newRecord['images'] = [];
      (await this.driveService.uploadMultiFiles(files)).forEach((e) => {
        newRecord['images'].push(e['_id']);
      });
    }
    if (!!detail && detail.length > 0) {
      const listDetail = detail.split('},');
      newRecord['detail'] = listDetail.map((e, index) => {
        let item = e;
        if (index < listDetail.length - 1) {
          item = e + '}';
        }
        return JSON.parse(item);
      });
    }

    if (!!category) {
      const categories = category.split(',');
      newRecord['categories'] = [];
      const listCategory = await this.getCategoryBySlugs(categories);
      if (!listCategory || listCategory.length < 1)
        throw new BadRequestException(CATEGORY_MESSAGE.NOT_FOUND);

      listCategory.forEach((category) => {
        newRecord['categories'].push(category._id);
      });
    }

    if ((!!amount || amount == 0) && amount != product.amount) {
      newRecord['amount'] = +amount;
    }
    await this.model.updateOne({ _id: product._id }, newRecord);

    return this.getOneAndPopulate({ _id: product._id });
  }

  async delete(slug: string) {
    const product = await this.getOneByCondition({ slug });
    if (!product) throw new BadRequestException(PRODUCT_MESSAGE.NOT_FOUND);
    return this.model.deleteOne({ _id: product._id });
  }

  async setCategories(slug: string, input: SetCategoriesDto) {
    const product = await this.getOneByCondition({ slug });
    if (!product) throw new BadRequestException(PRODUCT_MESSAGE.NOT_FOUND);

    const dataUpdate = [];
    dataUpdate.push(...product.categories);
    const categories = input.category.split(',');
    const listCategory = await this.getCategoryBySlugs(categories);
    if (!listCategory || listCategory.length < 1)
      throw new BadRequestException(CATEGORY_MESSAGE.NOT_FOUND);

    listCategory.forEach((category) => {
      dataUpdate.push(category._id);
    });

    await this.model.updateOne(
      { _id: product._id },
      { categories: dataUpdate },
    );

    return this.getOneAndPopulate({ _id: product._id });
  }

  async getOneAndPopulate(condition) {
    return this.model
      .aggregate([
        {
          $match: condition,
        },
        {
          $lookup: {
            from: CATEGORY_MODEL_NAME,
            localField: 'categories',
            foreignField: '_id',
            as: 'categories',
          },
        },
        {
          $lookup: {
            from: DRIVE_MODEL_NAME,
            localField: 'images',
            foreignField: '_id',
            as: 'images',
          },
        },
      ])
      .exec();
  }
}
