import { Repository } from 'typeorm';
import { Song } from '../../song/song.entity';
import { SongFiltersDto } from '../dto/songs.filter.dto';

export const findAllMarketplaceArtistSongs = async (
  songRepository: Repository<Song>,
  query: SongFiltersDto,
  take = 10,
  skip = 0,
): Promise<{ songs: Song[]; count: number }> => {
  let qb = songRepository
    .createQueryBuilder('song')
    .leftJoinAndSelect('song.user', 'user')
    .leftJoinAndSelect('song.album', 'album')
    .leftJoinAndSelect('album.cover', 'cover')
    .leftJoinAndSelect('song.music', 'music')
    .leftJoinAndSelect('song.art', 'art')
    .leftJoinAndSelect('song.licences', 'licences')
    .leftJoinAndSelect('licences.seller', 'seller')
    .leftJoinAndSelect('licences.buyer', 'buyer')
    .where('buyer IS NULL');

  if (query.title) {
    qb = qb.andWhere('song.title ILIKE :title', {
      title: `%${query.title}%`,
    });
  }

  if (query.artist) {
    qb = qb.andWhere('song.pka ILIKE :artist', {
      artist: `%${query.artist}%`,
    });
  }

  if (query.minLength) {
    qb = qb.andWhere('song.length >= :minLength', {
      minLength: query.minLength,
    });
  }

  if (query.maxLength) {
    qb = qb.andWhere('song.length <= :maxLength', {
      maxLength: query.maxLength,
    });
  }

  if (query.genre) {
    qb = qb.andWhere('song.genre ILIKE :genre', {
      genre: `%${query.genre}%`,
    });
  }

  if (query.mood) {
    qb = qb.andWhere(':mood = ANY(song.mood)', {
      mood: query.mood,
    });
  }

  if (query.tags) {
    qb = qb.andWhere(':tags = ANY(song.tags)', {
      tags: query.tags,
    });
  }

  if (query.minBpm) {
    qb = qb.andWhere('song.bpm >= :minBpm', {
      minBpm: query.minBpm,
    });
  }

  if (query.maxBpm) {
    qb = qb.andWhere('song.bpm <= :maxBpm', {
      maxBpm: query.maxBpm,
    });
  }

  if (query.instrumental !== undefined) {
    qb = qb.andWhere('song.instrumental = :instrumental', {
      instrumental: query.instrumental,
    });
  }

  if (query.musical_key) {
    qb = qb.andWhere('song.musical_key ILIKE :musical_key', {
      musical_key: `%${query.musical_key}%`,
    });
  }
  qb = qb.skip(skip).take(take);
  const [results, count] = await qb.getManyAndCount();

  return { songs: results, count };
};
