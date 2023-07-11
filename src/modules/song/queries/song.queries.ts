import { IsNull, Like, MoreThan, Not, Raw } from 'typeorm';

export const findOneSong = (id: string) => {
  return {
    where: { id },
    relations: [
      'user',
      'album.image',
      'music',
      'art',
      'listings',
      'listings.seller',
      'listings.buyer',
    ],
  };
};

export const findAllArtistSongs = (
  filters: any,
  user_id: string,
  take: number,
  skip: number,
) => {
  return {
    where: filters,
    relations: [
      'user',
      'album.image',
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
      'album.image',
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
