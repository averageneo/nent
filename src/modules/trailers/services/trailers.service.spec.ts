/* eslint-disable prettier/prettier */
import { AppModule } from './../../../app.module';
import { HttpException, HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { factoryRegistery } from '../../core/test_utils';
import { Connection } from 'typeorm';
import { TrailersEntity } from '../entities/trailers.entity';
import { TrailersService } from './trailers.service';
import '../factories';
import axios from 'axios';

describe('UsersService', () => {
  let app: INestApplication;
  let trailersMockRepository: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    app.useLogger(false);
    await app.init();
    factoryRegistery.setConnection(app.get(Connection));
    trailersMockRepository = moduleFixture.get(getRepositoryToken(TrailersEntity));
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('getTrailers', () => {
    const viaplayFakeData = {
      data: {
        _embedded: { 'viaplay:blocks': [{ _embedded: { 'viaplay:product': { content: { imdb: { id: 'someId' } } } } }] },
      },
    };

    const tmdbFakeId = { data: { movie_results: [{ id: 'someId' }] } };

    it('should return an instance of trailers entity', async () => {
      const trailer = factoryRegistery.make(TrailersEntity);
      const findOneSpy = jest.spyOn(trailersMockRepository, 'findOne').mockResolvedValue(trailer);

      const result = await app.get(TrailersService).getTrailers('somelink');

      expect(result).toEqual(trailer);
      expect(findOneSpy).toHaveBeenCalled();
    });

    it('should throw error that could not fetch data from viaplay', async () => {
      const findOneSpy = jest.spyOn(trailersMockRepository, 'findOne').mockResolvedValue(undefined);

      const axiosMock = jest
        .spyOn(axios, 'get')
        .mockRejectedValueOnce(
          new HttpException('Failed retrieving data from Viaplay API, Check your input URL', HttpStatus.BAD_REQUEST),
        );

      await expect(app.get(TrailersService).getTrailers('somelink')).rejects.toThrow(HttpException);
      expect(axiosMock).toHaveBeenCalled();
      expect(findOneSpy).toHaveBeenCalled();
    });

    it('should throw error that could not fetch TMDB id', async () => {
      const findOneSpy = jest.spyOn(trailersMockRepository, 'findOne').mockResolvedValue(undefined);
      const axiosMock = jest
        .spyOn(axios, 'get')
        .mockResolvedValueOnce(viaplayFakeData)
        .mockRejectedValueOnce(new HttpException('Failed retrieving data TMDB API', HttpStatus.SERVICE_UNAVAILABLE));

      await expect(app.get(TrailersService).getTrailers('somelink')).rejects.toThrow(HttpException);
      expect(axiosMock).toHaveBeenCalledTimes(2);
      expect(findOneSpy).toHaveBeenCalled();
    });

    it('should throw error that could not fetch TMDB data', async () => {
      const findOneSpy = jest.spyOn(trailersMockRepository, 'findOne').mockResolvedValue(undefined);
      const axiosMock = jest
        .spyOn(axios, 'get')
        .mockResolvedValueOnce(viaplayFakeData)
        .mockResolvedValueOnce(tmdbFakeId)
        .mockRejectedValueOnce(new HttpException('Failed retrieving data TMDB API', HttpStatus.SERVICE_UNAVAILABLE));

      await expect(app.get(TrailersService).getTrailers('somelink')).rejects.toThrow(HttpException);
      expect(axiosMock).toHaveBeenCalledTimes(3);
      expect(findOneSpy).toHaveBeenCalled();
    });

    it('should throw error that could not find any trailers for the movie', async () => {
      const findOneSpy = jest.spyOn(trailersMockRepository, 'findOne').mockResolvedValue(undefined);
      const axiosMock = jest
        .spyOn(axios, 'get')
        .mockResolvedValueOnce(viaplayFakeData)
        .mockResolvedValueOnce(tmdbFakeId)
        .mockRejectedValueOnce({ data: { results: [] } });

      await expect(app.get(TrailersService).getTrailers('somelink')).rejects.toThrow(HttpException);
      expect(axiosMock).toHaveBeenCalledTimes(3);
      expect(findOneSpy).toHaveBeenCalled();
    });

    it('should return an instance of trailer entity', async () => {
      const trailer = factoryRegistery.make(TrailersEntity, { trailerUrl: 'https://youtube.com/watch?v=G0DhqIhxSxI' });
      const findOneSpy = jest.spyOn(trailersMockRepository, 'findOne').mockResolvedValue(undefined);
      const saveSpy = jest.spyOn(trailersMockRepository, 'save').mockResolvedValue(trailer);
      const axiosMock = jest
        .spyOn(axios, 'get')
        .mockResolvedValueOnce(viaplayFakeData)
        .mockResolvedValueOnce(tmdbFakeId)
        .mockResolvedValueOnce({ data: { results: [{ type: 'Trailer', site: 'YouTube', key: 'G0DhqIhxSxI' }] } });

      const result = await app.get(TrailersService).getTrailers('somelink');
      expect(result).toEqual(trailer);
      expect(axiosMock).toHaveBeenCalledTimes(3);
      expect(findOneSpy).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalled();
    });
  });
});
