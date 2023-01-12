import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { changeToSlug } from 'src/shared';
import { Category } from '../category/category.schema';
import { CloudService } from '../cloud/cloud.service';
import {
  CATEGORY_MESSAGE,
  CATEGORY_MODEL_NAME,
  CLOUD_MODEL_NAME,
  PRODUCT_MESSAGE,
  PRODUCT_MODEL_NAME,
} from '../constant';
import { ProductDto, QueryFilter, SetCategoriesDto } from './product.dto';
import { Product } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(PRODUCT_MODEL_NAME)
    private model: Model<Product & Document>,
    @InjectModel(CATEGORY_MODEL_NAME)
    private categoryModel: Model<Category & Document>,

    private cloudService: CloudService,
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
      isSale,
      sortPrice,
      sortSale,
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
          from: CLOUD_MODEL_NAME,
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

    if (!!keyword) {
      const key = new RegExp(keyword, 'i');
      queryFilter.push({
        $match: {
          $or: [
            { name: key },
            { slug: key },
            { description: key },
            { 'detail.size': key },
            { 'detail.price': key },
            { 'categories.slug': key },
            { 'categories.name': key },
          ],
        },
      });
    }

    if (!!sortSale && sortSale == 'true') {
      queryFilter.push({ $sort: { sale: -1 } });
    } else if (!!sortSale && sortSale == 'false') {
      queryFilter.push({ $sort: { sale: 1 } });
    }

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
      categories.forEach((e) => {
        queryFilter.push({ $match: { 'categories.slug': e } });
      });
    }

    if (!!isSale && isSale == 'true') {
      queryFilter.push({ $match: { sale: { $ne: null } } });
    } else if (!!isSale && isSale == 'false') {
      queryFilter.push({
        $match: {
          $or: [{ sale: { $exists: false } }, { sale: { $eq: null } }],
        },
      });
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
    const result = data.map((e) => {
      if (!!e.sale) {
        e.detail.map((o) => {
          o['new_price'] = parseFloat(
            ((+o.price * (100 - +e.sale)) / 100).toFixed(2),
          );
          return o;
        });
      }
      return e;
    });
    return { total: allData[0]?.total, data: result };
  }

  async getOneByCondition(condition) {
    return this.model.findOne(condition).lean();
  }

  async getCategoryBySlugs(slugs: string[]) {
    return this.categoryModel.find({ slug: { $in: slugs } }).lean();
  }

  async create(input: ProductDto, files: Array<Express.Multer.File>) {
    const { name, detail, description, amount, sale, category } = input;
    if (!name) throw new BadRequestException(PRODUCT_MESSAGE.NAME_NOT_NULL);
    const listImageId = [];
    if (!!files && files.length > 0) {
      (await this.cloudService.uploadMultiFiles(files)).forEach((e) => {
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
        sale: !!sale ? +sale : null,
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
    const { name, detail, description, amount, category, sale } = input;
    const newRecord = {};
    if (!!name && name != product.name) newRecord['name'] = name;
    if (!!description && description != product.description)
      newRecord['description'] = description;
    if (!!files && files.length > 0) {
      newRecord['images'] = [];
      (await this.cloudService.uploadMultiFiles(files)).forEach((e) => {
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
    await this.model.updateOne(
      { _id: product._id },
      { ...newRecord, sale: !!sale ? +sale : null },
    );

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
    const result = await this.model
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
            from: CLOUD_MODEL_NAME,
            localField: 'images',
            foreignField: '_id',
            as: 'images',
          },
        },
      ])
      .exec();

    const data = result.map((e) => {
      if (!!e.sale) {
        e.detail.map((o) => {
          o['new_price'] = parseFloat(
            ((+o.price * (100 - +e.sale)) / 100).toFixed(2),
          );
          return o;
        });
      }
      return e;
    });
    return data[0];
  }

  async setSale(slug: string, sale: number) {
    const product = await this.getOneByCondition({ slug });
    if (!product) throw new BadRequestException(PRODUCT_MESSAGE.NOT_FOUND);
    await this.model.updateOne(
      { _id: product._id },
      { sale: !!sale ? +sale : sale },
    );

    return this.getOneAndPopulate({ _id: product._id });
  }
}
