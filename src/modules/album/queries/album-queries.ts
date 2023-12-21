import { Repository } from 'typeorm';
import { Album } from '../album.entity';

export const findAllAlbumsQuery = async (
  albumRepository: Repository<Album>,
  take = 10,
  skip = 0,
): Promise<{ result: Album[]; total: number }> => {
  const qb = albumRepository
    .createQueryBuilder('album')
    .leftJoinAndSelect('album.cover', 'cover')
    .leftJoinAndSelect('album.songs', 'song')
    .leftJoinAndSelect('song.user', 'user')
    .leftJoinAndSelect('song.music', 'music')
    .leftJoinAndSelect('song.art', 'art')
    .take(take)
    .skip(skip);

  const [result, total] = await qb.getManyAndCount();

  return { result, total };
};

export const findAllArtistAlbumsQuery = async (
  albumRepository: Repository<Album>,
  take = 10,
  skip = 0,
  artistId: string,
): Promise<{ result: Album[]; total: number }> => {
  const qb = albumRepository
    .createQueryBuilder('album')
    .leftJoinAndSelect('album.cover', 'cover')
    .leftJoinAndSelect('album.songs', 'song')
    .leftJoinAndSelect('song.user', 'user')
    .leftJoinAndSelect('song.music', 'music')
    .leftJoinAndSelect('song.art', 'art')
    .where('album.created_by_id = :artistId', { artistId })
    .take(take)
    .skip(skip);

  const [result, total] = await qb.getManyAndCount();

  return { result, total };
};

export const findOneAlbumQuery = (id: string) => {
  return {
    where: {
      id,
    },
    relations: {
      cover: true,
      songs: {
        user: true,
        music: true,
        art: true,
      },
    },
  };
};
