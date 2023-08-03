export const findAllAlbumsQuery = (take: number, skip: number) => {
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
  };
};

export const findAllArtistAlbumsQuery = (
  take: number,
  skip: number,
  id: string,
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
    where: { created_by_id: id },
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
