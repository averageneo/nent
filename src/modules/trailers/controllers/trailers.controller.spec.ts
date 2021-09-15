/* eslint-disable prettier/prettier */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { factoryRegistery } from '../../core/test_utils';
import { Connection } from 'typeorm';
import { TrailersEntity } from '../entities/trailers.entity';
import '../factories';
import { TrailersService } from '../services/trailers.service';
import { TrailersController } from './trailers.controller';

describe('Users Controller', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    factoryRegistery.setConnection(app.get(Connection));
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('controllers tests', () => {
    it('should return instance of trailers', async () => {
      const trailer = factoryRegistery.make(TrailersEntity, { trailerUrl: 'https://youtube.com/watch?v=G0DhqIhxSxI' });
      const getTrailersSpy = jest.spyOn(app.get(TrailersService), 'getTrailers').mockResolvedValue(trailer);

      const result = await app.get(TrailersController).getTrailers({ viaplay_url: 'somelink' });
      expect(result).toEqual(trailer);
      expect(getTrailersSpy).toHaveBeenCalled();
    });
  });
});
