import { Like } from 'typeorm';

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

export const findAllSongsArtist = (
  title: string,
  user_id: string,
  take: number,
  skip: number,
) => {
  return {
    where: { title: Like('%' + title + '%'), user: { id: user_id } },
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
