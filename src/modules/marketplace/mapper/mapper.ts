import { SongDto } from '../../song/dto/song.dto';
import { PaginatedDto } from '../../../common/pagination/paginated-dto';

export const mapPaginatedExtendedSongsDto = (
  extendedSongs: SongDto[],
  total: number,
  take?: number,
  skip?: number,
): PaginatedDto<SongDto> => {
  return {
    total: total,
    take: Number(take),
    skip: Number(skip),
    count: extendedSongs.length,
    results: extendedSongs,
  };
};
