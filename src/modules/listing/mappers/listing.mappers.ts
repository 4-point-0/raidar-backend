import { Song } from '../../../modules/song/song.entity';
import { User } from '../../../modules/user/user.entity';
import { Listing } from '../listing.entity';

export const createListingMapper = (
  price: number,
  song: Song,
  user: User,
): Partial<Listing> => {
  return {
    price: price,
    song: song,
    seller: user,
  };
};
