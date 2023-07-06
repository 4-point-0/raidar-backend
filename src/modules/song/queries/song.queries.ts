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
