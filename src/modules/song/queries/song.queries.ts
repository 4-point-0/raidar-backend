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
