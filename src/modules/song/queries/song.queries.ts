import { Like, Raw, Repository } from 'typeorm';
import { Song } from '../song.entity';
import { SongFiltersDto } from '../dto/songs.filter.dto';

export const findOneSong = (id: string) => {
  return {
    where: { id },
    relations: [
      'user',
      'album.cover',
      'music',
      'art',
      'listings',
      'listings.seller',
      'listings.buyer',
    ],
  };
};

export const findAllArtistSongs = async (
  songRepository: Repository<Song>,
  userId: string,
  query: SongFiltersDto,
  take = 10,
  skip = 0,
): Promise<Song[]> => {
  let qb = songRepository
    .createQueryBuilder('song')
    .leftJoinAndSelect('song.user', 'user')
    .leftJoinAndSelect('song.album', 'album')
    .leftJoinAndSelect('album.image', 'image')
    .leftJoinAndSelect('song.music', 'music')
    .leftJoinAndSelect('song.art', 'art')
    .leftJoinAndSelect('song.listings', 'listings')
    .leftJoinAndSelect('listings.seller', 'seller')
    .leftJoinAndSelect('listings.buyer', 'buyer')
    .where('user.id = :userId', { userId });

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
  const sql = qb.getQueryAndParameters();
  console.log(sql[0]);
  return await qb.getMany();
};

export const findAllUserSongs = (
  title: string,
  user_id: string,
  take: number,
  skip: number,
) => {
  return {
    where: {
      title: Like('%' + title + '%'),
      listings: { buyer: { id: user_id } },
      music: { url_expiry: Raw((alias) => `${alias} > NOW()`) },
    },
    relations: [
      'user',
      'album.cover',
      'music',
      'art',
      'listings',
      'listings.seller',
      'listings.buyer',
    ],
    take: take,
    skip: skip,
  };
};
