import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import 'dotenv/config';

@Module({
  imports: [MongooseModule.forRoot(process.env.MIGRATE_dbConnectionUri)],
})
export class DatabaseModule {}
