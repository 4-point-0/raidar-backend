import { IsNull, Like, Raw } from 'typeorm';

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

export const findOneNotSoldSong = (id: string) => {
  return {
    where: { id, listings: { buyer: IsNull() } },
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
      'listings',
      'listings.seller',
      'listings.buyer',
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
