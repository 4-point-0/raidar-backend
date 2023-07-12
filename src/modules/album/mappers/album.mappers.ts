import { PaginatedDto } from '../../../common/pagination/paginated-dto';
import { Album } from '../album.entity';
import { AlbumDto } from '../dto/album.dto';

export const mapPaginatedAlbums = (
  albums: Album[],
  total: number,
  take?: number,
  skip?: number,
): PaginatedDto<AlbumDto> => {
  const albumDtos: AlbumDto[] = [];
  for (const album of albums) {
    albumDtos.push(AlbumDto.fromEntity(album));
  }

  return {
    total: total,
    take: Number(take),
    skip: Number(skip),
    count: albumDtos.length,
    results: albumDtos,
  };
};
