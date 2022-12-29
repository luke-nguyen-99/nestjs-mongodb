import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CLOUD_MODEL_NAME } from '../constant';
import { Cloud } from './cloud.schema';
import { ImageKitClient } from '@platohq/nestjs-imagekit';

@Injectable()
export class CloudService {
  constructor(
    @InjectModel(CLOUD_MODEL_NAME)
    private model: Model<Cloud & Document>,
    private cloudService: ImageKitClient,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<any> {
    return this.cloudService.upload({
      file: file.buffer,
      fileName: file.originalname,
    });
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
    return this.cloudService.deleteFile(fileId);
  }

  async uploadMultipleFiles(
    files: Array<Express.Multer.File>,
  ): Promise<Cloud[]> {
    const result = [];
    for (let i = 0; i < files.length; i++) {
      result.push(await this.createRecord(files[i]));
    }
    return result;
  }
}
