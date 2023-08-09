import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from '../../../modules/file/dto/file.dto';
import { BaseDto } from '../../../common/dto/base.dto';
import { Album } from '../../../modules/album/album.entity';

export class SongAlbumDto extends BaseDto implements Readonly<SongAlbumDto> {
  @ApiProperty({
    type: String,
    required: true,
  })
  title: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  pka: string;

  @ApiProperty({ type: FileDto })
  cover: FileDto;

  static from(album: Partial<SongAlbumDto>): SongAlbumDto {
    const albumDto = new SongAlbumDto();
    albumDto.id = album.id;
    albumDto.title = album.title;
    albumDto.pka = album.pka;
    albumDto.cover = album.cover;
    albumDto.created_at = album.created_at;
    albumDto.updated_at = album.updated_at;
    albumDto.created_by_id = album.created_by_id;
    albumDto.updated_by_id = album.updated_by_id;
    return albumDto;
  }

  public static fromEntity(entity: Album) {
    return this.from({
      id: entity.id,
      title: entity.title,
      pka: entity.pka,
      cover: FileDto.fromEntity(entity.cover),
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      created_by_id: entity.created_by_id,
      updated_by_id: entity.updated_by_id,
    });
  }

  public static fromEntityForSong(entity: Album) {
    return this.from({
      id: entity.id,
      title: entity.title,
      pka: entity.pka,
      cover: FileDto.fromEntity(entity.cover),
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      created_by_id: entity.created_by_id,
      updated_by_id: entity.updated_by_id,
    });
  }
}
