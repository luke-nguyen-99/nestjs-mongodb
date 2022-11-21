import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class BaseCRUDService<T, I> {
  constructor(protected model: mongoose.Model<T & mongoose.Document>) {}

  async create(input: I): Promise<T> {
    const createdValueSet = new this.model(input);
    return await createdValueSet.save();
  }

  async findAll(): Promise<T[]> {
    return await this.model.find().exec();
  }

  async findById(id: string): Promise<T[]> {
    return [await this.model.findById(id).exec()];
  }

  async delete(id: string): Promise<T> {
    return await this.model.findByIdAndRemove(id);
  }

  async update(id: string, input: I): Promise<T> {
    return await this.model.findByIdAndUpdate(id, input);
  }
}
