import { IsNull, Repository } from 'typeorm';
import { Song } from '../song.entity';

export const findOneSong = (id: string) => {
  return {
    where: { id },
    relations: [
      'user',
      'album.cover',
      'music',
      'art',
      'licences',
      'licences.seller',
      'licences.buyer',
    ],
  };
};

export const findOneNotSoldSong = (id: string) => {
  return {
    where: { id, licences: { buyer: IsNull() } },
    relations: [
      'user',
      'album.cover',
      'music',
      'art',
      'licences',
      'licences.seller',
      'licences.buyer',
    ],
  };
};

export const findAllArtistSongs = async (
  songRepository: Repository<Song>,
  title: string,
  userId: string,
  take = 10,
  skip = 0,
): Promise<{ result: Song[]; total: number }> => {
  const qb = songRepository
    .createQueryBuilder('song')
    .leftJoinAndSelect('song.user', 'user')
    .leftJoinAndSelect('song.album', 'album')
    .leftJoinAndSelect('album.cover', 'cover')
    .leftJoinAndSelect('song.music', 'music')
    .leftJoinAndSelect('song.art', 'art')
    .where('song.title ILIKE :title', { title: `%${title}%` })
    .andWhere('song.user.id = :userId', { userId })
    .take(take)
    .skip(skip);

  const [result, total] = await qb.getManyAndCount();

  return { result, total };
};

export const findAllUserSongs = async (
  songRepository: Repository<Song>,
  title: string,
  user_id: string,
  take = 10,
  skip = 0,
): Promise<{ result: Song[]; total: number }> => {
  const qb = songRepository
    .createQueryBuilder('song')
    .leftJoinAndSelect('song.user', 'user')
    .leftJoinAndSelect('song.album', 'album')
    .leftJoinAndSelect('album.cover', 'cover')
    .leftJoinAndSelect('song.music', 'music')
    .leftJoinAndSelect('song.art', 'art')
    .leftJoinAndSelect('song.licences', 'licences')
    .leftJoinAndSelect('licences.seller', 'seller')
    .leftJoinAndSelect('licences.buyer', 'buyer')
    .where('song.title LIKE :title', { title: `%${title}%` })
    .andWhere('music.url_expiry > NOW()')
    .andWhere('buyer.id = :userId', { userId: user_id })
    .take(take)
    .skip(skip);

  const [result, total] = await qb.getManyAndCount();

  return { result, total };
};

export const findSongWithUser = (songId: string) => {
  return {
    where: { id: songId },
    relations: ['user', 'music'],
  };
};

export const findSongByTokenContractId = (token_contract_id: string) => {
  return {
    where: { token_contract_id: Number.parseInt(token_contract_id) },
    relations: ['art'],
  };
};
