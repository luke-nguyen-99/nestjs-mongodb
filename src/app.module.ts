import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ImageKitModule } from '@platohq/nestjs-imagekit';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DataModule } from './data/data.module';
import { DatabaseModule } from './database/database.module';
import { AuthenticationGuard } from './shared/guard/auth.guard';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    DatabaseModule,
    SharedModule,
    AuthModule,
    DataModule,
    ImageKitModule.register({
      publicKey: 'public_3wCTjctnNFfvuyDEhY849hOfuG4=',
      privateKey: 'private_4vcAblYbeDU1iWUInBciT7bkrtk=',
      urlEndpoint: 'https://ik.imagekit.io/muaban1',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class AppModule {}
