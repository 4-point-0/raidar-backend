import { Song } from '../../song/song.entity';
import { User } from '../../user/user.entity';
import { Licence } from '../licence.entity';

export const createLicenceMapper = (
  price: number,
  song: Song,
  user: User,
): Partial<Licence> => {
  return {
    price: price,
    song: song,
    seller: user,
  };
};
