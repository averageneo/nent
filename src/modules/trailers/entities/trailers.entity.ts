import { BaseEntity } from './../../core/entities.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'trailers' })
export class TrailersEntity extends BaseEntity<TrailersEntity> {
  @Column({ nullable: false, type: 'varchar', unique: true, name: 'imdb_id' })
  imdbId!: string;

  @Column({ nullable: false, type: 'varchar', name: 'trailer_url' })
  trailerUrl!: string;

  @Column({ nullable: true, type: 'varchar', name: 'viaplay_url' })
  viaplayUrl!: string | null;
}
