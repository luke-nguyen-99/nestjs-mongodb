import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PRODUCT_MESSAGE, PRODUCT_MODEL_NAME } from '../constant';
import { ProductDto, QueryFilter } from './product.dto';
import { Product } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(PRODUCT_MODEL_NAME)
    private model: Model<Product & Document>,
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
      sortPrice,
      sortCreatedAt,
      sortUpdatedAt,
    } = filter;
    const queryFilter = [];

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

  async create(input: ProductDto) {
    const { name, detail, description, images } = input;
    if (!name) throw new BadRequestException(PRODUCT_MESSAGE.NAME_NOT_NULL);
    if (!images || images.length == 0)
      throw new BadRequestException(PRODUCT_MESSAGE.IMAGES_NOT_NULL);

    if (!detail || detail.length == 0)
      throw new BadRequestException(PRODUCT_MESSAGE.SIZE_NOT_NULL);

    return this.model.insertMany([{ name, detail, description, images }]);
  }

  async getOne(id: string) {
    return this.model.findOne({ _id: id });
  }
  async update(id: string, input: ProductDto) {
    const product = await this.model.findOne({ _id: id }).lean().exec();
    if (!product) throw new BadRequestException(PRODUCT_MESSAGE.NOT_FOUND);
    const { name, detail, description, images } = input;
    const newRecord = {};
    if (!!name && name != product.name) newRecord['name'] = name;
    if (!!description && description != product.description)
      newRecord['description'] = description;
    if (!!images && images.length > 0) newRecord['images'] = images;
    if (!!detail && detail.length > 0) newRecord['detail'] = detail;

    await this.model.updateOne({ _id: id }, newRecord);

    return this.model.findOne({ _id: id });
  }

  async delete(id: string) {
    const product = await this.model.findOne({ _id: id }).lean().exec();
    if (!product) throw new BadRequestException(PRODUCT_MESSAGE.NOT_FOUND);
    return this.model.deleteOne({ _id: id });
  }
}
