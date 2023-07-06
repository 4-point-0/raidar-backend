import { ApiProperty } from '@nestjs/swagger';
import { Album } from '../album.entity';
import { FileDto } from '../../../modules/file/dto/file.dto';

export class AlbumDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  id: string;

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

  static fromEntity(album: Album): AlbumDto {
    const albumDto = new AlbumDto();
    albumDto.id = album.id;
    albumDto.title = album.title;
    albumDto.pka = album.pka;
    albumDto.image = FileDto.fromEntity(album.image);
    return albumDto;
  }
}
