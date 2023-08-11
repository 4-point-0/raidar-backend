import { Song } from '../../song/song.entity';
import { User } from '../../user/user.entity';
import { Licence } from '../licence.entity';

export const createLicenceMapper = (
  sold_price: string,
  song: Song,
  user: User,
): Partial<Licence> => {
  return {
    sold_price: sold_price,
    song: song,
    seller: user,
  };
};
