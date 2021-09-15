import { factoryRegistery } from '../../../core/test_utils';
import { TrailersEntity } from '../entities/trailers.entity';

factoryRegistery.register(TrailersEntity, ({ ch, override = {} }) => {
  return new TrailersEntity({
    trailerUrl: ch.url(),
    viaplayUrl: ch.url(),
    imdbId: ch.string(),
    ...override,
  });
});
