import { Like } from 'typeorm';

export const findAllAlbumsQuery = (
  take: number,
  skip: number,
  pka?: string,
) => {
  return {
    relations: {
      cover: true,
      songs: {
        user: true,
        music: true,
        art: true,
        listings: {
          buyer: true,
          seller: true,
        },
      },
    },
    take: take,
    skip: skip,
    where: pka ? { pka: Like('%' + pka + '%') } : undefined,
  };
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
        listings: {
          buyer: true,
          seller: true,
        },
      },
    },
  };
};
