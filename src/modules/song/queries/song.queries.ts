import { IsNull, Like, Raw } from 'typeorm';

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

export const findAllArtistSongs = (
  title: string,
  user_id: string,
  take: number,
  skip: number,
) => {
  return {
    where: {
      title: Like('%' + title + '%'),
      user: { id: user_id },
    },
    relations: [
      'user',
      'album.cover',
      'music',
      'art',
      'licences',
      'licences.seller',
      'licences.buyer',
    ],
    take: take,
    skip: skip,
  };
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
      licences: { buyer: { id: user_id } },
      music: { url_expiry: Raw((alias) => `${alias} > NOW()`) },
    },
    relations: [
      'user',
      'album.cover',
      'music',
      'art',
      'licences',
      'licences.seller',
      'licences.buyer',
    ],
    take: take,
    skip: skip,
  };
};
