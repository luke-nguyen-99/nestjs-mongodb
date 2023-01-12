import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUD_MODEL_NAME } from '../constant';
import { Cloud } from './cloud.schema';
import * as fs from 'fs';
import 'dotenv/config';

@Injectable()
export class CloudService {
  constructor(
    @InjectModel(CLOUD_MODEL_NAME)
    private model: Model<Cloud & Document>,
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    const path = `./${file.path}`;
    const result = await cloudinary.uploader.upload(path);
    fs.unlinkSync(`./${path}`);
    return result;
  }

  async createRecord(file: Express.Multer.File): Promise<Cloud> {
    const data = await this.uploadFile(file);
    const newRecord = await this.model.create({
      url: data.url,
      file_id: data.fileId,
    });
    return newRecord;
  }

  async removeFile(fileId: string): Promise<any> {
    console.log(fileId);
  }

  async uploadMultiFiles(files: Array<Express.Multer.File>): Promise<Cloud[]> {
    const result = [];
    for (let i = 0; i < files.length; i++) {
      result.push(await this.createRecord(files[i]));
    }
    return result;
  }
}
