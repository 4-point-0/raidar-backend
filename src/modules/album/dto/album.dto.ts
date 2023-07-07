import { ApiProperty } from '@nestjs/swagger';
import { Album } from '../album.entity';
import { FileDto } from '../../../modules/file/dto/file.dto';
import { BaseDto } from '../../../common/dto/base.dto';

export class AlbumDto extends BaseDto implements Readonly<AlbumDto> {
  @ApiProperty({
    type: String,
    required: true,
  })
  title: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  pka: string;

  @ApiProperty({ type: FileDto })
  image: FileDto;

  static from(album: Partial<AlbumDto>): AlbumDto {
    const albumDto = new AlbumDto();
    albumDto.id = album.id;
    albumDto.title = album.title;
    albumDto.pka = album.pka;
    albumDto.image = album.image;
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
      image: FileDto.fromEntity(entity.image),
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      created_by_id: entity.created_by_id,
      updated_by_id: entity.updated_by_id,
    });
  }
}