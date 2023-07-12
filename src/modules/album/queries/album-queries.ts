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
