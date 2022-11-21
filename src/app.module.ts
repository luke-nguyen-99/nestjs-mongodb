import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DataModule } from './data/data.module';
import { DatabaseModule } from './database/database.module';
import { AuthenticationGuard } from './shared/guard/auth.guard';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [DatabaseModule, SharedModule, DataModule, AuthModule],
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
