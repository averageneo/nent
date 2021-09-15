/* eslint-disable prettier/prettier */
import { CacheInterceptor, Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { GetTrailerDto } from '../dto/get-trailer.dto';
import { TrailersEntity } from '../entities/trailers.entity';
import { TrailersService } from '../services/trailers.service';

@Controller('trailers')
export class TrailersController {
  constructor(private readonly trailersService: TrailersService) {}

  @Get()
  @UseInterceptors(CacheInterceptor) // cache requests
  getTrailers(@Query() { viaplay_url }: GetTrailerDto): Promise<TrailersEntity> {
    return this.trailersService.getTrailers(viaplay_url);
  }
}
