/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrailersEntity } from '../entities/trailers.entity';
import axios, { AxiosResponse } from 'axios';
import { configService } from '../../core/config';

@Injectable()
export class TrailersService {
  constructor(
    @InjectRepository(TrailersEntity)
    private readonly trailersRepository: Repository<TrailersEntity>,
  ) {}

  async getTrailers(viaplay_url: string): Promise<TrailersEntity> {
    /*
        I have cached requests, but by any chance if data in cache is not avaible,
        it will be provided from database instead of going through all the logic again
    */

    const trailer = await this.trailersRepository.findOne({
      where: { viaplayUrl: viaplay_url },
    });

    if (trailer) {
      return trailer;
    }

    const imdbId = await axios
      .get(viaplay_url)
      .catch(() => {
        throw new HttpException('Failed retrieving data from Viaplay API, Check your input URL', HttpStatus.BAD_REQUEST);
      })
      .then((resp: AxiosResponse) => resp.data._embedded['viaplay:blocks'][0]._embedded['viaplay:product'].content.imdb.id);

    const tmdbAPI = configService.getValue('TMDB_API');
    const tmdbAPIKey = configService.getValue('TMDB_API_KEY');

    const tmdbId = await axios
      .get(`${tmdbAPI}/find/${imdbId}?api_key=${tmdbAPIKey}&external_source=imdb_id`)
      .catch(() => {
        throw new HttpException('Failed retrieving data TMDB API', HttpStatus.SERVICE_UNAVAILABLE);
      })
      .then((resp: AxiosResponse) => resp.data.movie_results[0].id);

    const tmdbData = await axios
      .get(`${tmdbAPI}/movie/${tmdbId}/videos?api_key=${tmdbAPIKey}&external_source=imdb_id`)
      .catch(() => {
        throw new HttpException('Failed retrieving data TMDB API', HttpStatus.SERVICE_UNAVAILABLE);
      })
      .then((resp: AxiosResponse) => resp.data.results);

    const trailers = tmdbData.filter((res) => res.type === 'Trailer');
    if (trailers.length > 0) {
      const site = trailers[0].site;
      const key = trailers[0].key;

      let trailerUrl: string;

      if (site == 'Vimeo') trailerUrl = 'https://vimeo.com/' + key;
      if (site == 'YouTube') trailerUrl = 'https://youtube.com/watch?v=' + key;

      return this.trailersRepository.save({ imdbId: imdbId, viaplayUrl: viaplay_url, trailerUrl: trailerUrl });
    } else {
      throw new NotFoundException('Could not find any trailers for this movie');
    }
  }
}
