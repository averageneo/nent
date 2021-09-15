/* eslint-disable prettier/prettier */
import { TrailersModule } from './modules/trailers/trailers.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './modules/core/config';

@Module({
  imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig()), TrailersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
