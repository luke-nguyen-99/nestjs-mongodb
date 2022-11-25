import { GoogleSpreadsheet } from 'google-spreadsheet';
import { Injectable } from '@nestjs/common';
import { drive_v3, google } from 'googleapis';
import * as stream from 'stream';
import 'dotenv/config';
import { extname } from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { DRIVE_MODEL_NAME } from '../constant';
import { Model } from 'mongoose';
import { Drive } from './drive.schema';

@Injectable()
export class DriveService {
  private drive: drive_v3.Drive;
  private doc = new GoogleSpreadsheet(
    '1y0h_C1Ivjgffemb2gGtLjSYOOy4adRrfkG_qzEVy5CI',
  );

  private createDriveClient(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    refreshToken: string,
  ) {
    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    client.setCredentials({ refresh_token: refreshToken });
    return google.drive({
      version: 'v3',
      auth: client,
    });
  }

  constructor(
    @InjectModel(DRIVE_MODEL_NAME)
    private model: Model<Drive & Document>,
  ) {
    this.drive = this.createDriveClient(
      process.env.google_drive_client_id,
      process.env.google_drive_client_secret,
      process.env.google_drive_redirect_uri,
      process.env.google_drive_refresh_token,
    );

    // const oauth2Client = new google.auth.OAuth2(
    //   process.env.google_drive_client_id,
    //   process.env.google_drive_client_secret,
    //   process.env.google_drive_redirect_uri,
    // );
    // oauth2Client.setCredentials({
    //   refresh_token: process.env.google_drive_refresh_token,
    // });
    // this.doc.useOAuth2Client(oauth2Client).then();
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    const result = await this.drive.files.create({
      media: {
        body: bufferStream,
      },
      requestBody: {
        name: `${Date.now()}${extname(file.originalname)}`,
        mimeType: file.mimetype,
      },
      fields: 'id',
    });

    await this.drive.permissions.create({
      fileId: result.data.id,
      requestBody: { role: 'writer', type: 'anyone' },
    });

    return 'https://drive.google.com/uc?export=view&id=' + result.data.id;
  }

  async removeFile(url: string) {
    console.log(url);
  }

  async create(file: Express.Multer.File): Promise<Drive> {
    const url = await this.uploadFile(file);
    const newRecord = await this.model.create({
      url,
    });
    return newRecord;
  }

  async delete(id: string) {
    console.log(id);
  }

  async uploadMultiFiles(files: Array<Express.Multer.File>): Promise<Drive[]> {
    // const promiseUploadFile = files.map((file) => this.create(file));
    // return Promise.all([...promiseUploadFile]);
    const result = [];
    for (let i = 0; i < files.length; i++) {
      result.push(await this.create(files[i]));
    }
    return result;
  }
}
