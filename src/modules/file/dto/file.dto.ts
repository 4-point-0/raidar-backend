import { ApiProperty } from '@nestjs/swagger';
import { File } from '../file.entity';
import { BaseDto } from '../../../common/dto/base.dto';

export class FileDto extends BaseDto {
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

  public static from(dto: Partial<FileDto>) {
    const fileDto = new FileDto();
    fileDto.id = dto.id;
    fileDto.name = dto.name;
    fileDto.url = dto.url;
    fileDto.key = dto.key;
    fileDto.mime_type = dto.mime_type;
    fileDto.created_at = dto.created_at;
    fileDto.updated_at = dto.updated_at;
    fileDto.created_by_id = dto.created_by_id;
    fileDto.updated_by_id = dto.updated_by_id;
    return fileDto;
  }

  public static fromEntity(entity: File) {
    return this.from({
      id: entity.id,
      name: entity.name,
      url: entity.url,
      key: entity.key,
      mime_type: entity.mime_type,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      created_by_id: entity.created_by_id,
      updated_by_id: entity.updated_by_id,
    });
  }
}
