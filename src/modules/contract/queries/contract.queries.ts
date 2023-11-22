import { IsNull, Not } from 'typeorm';

export const findBaseContractsByArtist = (
  artistId: string,
  take: number,
  skip: number,
) => {
  return {
    where: {
      artist: { id: artistId },
      customer: IsNull(),
    },
    relations: ['artist', 'customer', 'song'], // Make sure to include all necessary relations
    take,
    skip,
  };
};

export const findSignedContractsByArtist = (
  artistId: string,
  take: number,
  skip: number,
) => {
  return {
    where: {
      artist: { id: artistId },
      customer: Not(IsNull()),
    },
    relations: ['artist', 'customer', 'song'], // Make sure to include all necessary relations
    take,
    skip,
  };
};

export const findAllContractsByUser = (
  userId: string,
  take: number,
  skip: number,
) => {
  return {
    where: {
      customer: { id: userId },
    },
    relations: ['artist', 'customer', 'song'], // Make sure to include all necessary relations
    take,
    skip,
  };
};
