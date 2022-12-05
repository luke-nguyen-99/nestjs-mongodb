import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CLOUD_MODEL_NAME } from '../constant';
import ImageKit from 'imagekit';
import { Cloud } from './cloud.schema';

@Injectable()
export class CloudService {
  private imagekit: ImageKit;
  constructor(
    @InjectModel(CLOUD_MODEL_NAME)
    private model: Model<Cloud & Document>,
  ) {
    // this.imagekit = new ImageKit({
    //   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    //   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    //   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    // });
  }

  async uploadFileByLocal(file: Express.Multer.File) {
    const imagekit2 = new ImageKit({
      // publicKey: 'public_8/IZl69nGYpaCk1KfeE0Po31//c=',
      // privateKey: 'private_rzlH272JtBAUgbK1AkuKK+02RI0=',
      // urlEndpoint: 'https://ik.imagekit.io/shopaura/',
      publicKey: 'public_rwz6sID+Zhxob7eW1DmIgcWn1a0=',
      privateKey: 'private_qqCYmkfZ6QzaCFNuWCi2SZV2auQ=',
      urlEndpoint: 'https://ik.imagekit.io/shopaura',
      // uploadEndpoint: 'https://upload.imagekit.io/api/v1/files/upload',
      // transformationPosition: 'path',
    });
    const a = await imagekit2.upload({
      file: file.buffer,
      fileName: file.filename,
    });

    console.log(a);

    return '';
  }

  async uploadMultipleFiles(files: Array<Express.Multer.File>) {
    for (let i = 0; i < files.length; i++) {
      const a = await this.uploadFileByLocal(files[i]);
      console.log(a);
    }
  }
}
