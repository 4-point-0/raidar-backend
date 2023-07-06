import { ApiProperty } from '@nestjs/swagger';
import { File } from '../file.entity';

export class FileDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  id: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  url: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  key: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  mime_type: string;

  static fromEntity(file: File): FileDto {
    const fileDto = new FileDto();
    fileDto.id = file.id;
    fileDto.name = file.name;
    fileDto.url = file.url;
    fileDto.key = file.key;
    fileDto.mime_type = file.mime_type;
    return fileDto;
  }
}
