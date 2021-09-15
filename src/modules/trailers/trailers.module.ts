/* eslint-disable prettier/prettier */
import { TrailersService } from './services/trailers.service';
import { CacheModule, Module } from '@nestjs/common';
import { TrailersController } from './controllers/trailers.controller';
import { TrailersEntity } from './entities/trailers.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../../core/config';

@Module({
  imports: [TypeOrmModule.forFeature([TrailersEntity]), CacheModule.register(configService.getRedisConfig())],
  controllers: [TrailersController],
  providers: [TrailersService],
})
export class TrailersModule {}
