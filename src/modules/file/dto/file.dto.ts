import { ApiProperty } from '@nestjs/swagger';
import { File } from '@prisma/client';

export class FileDto implements Readonly<FileDto> {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String, isArray: true })
  tags: string[];

  @ApiProperty({ type: String })
  mime_type: string;

  @ApiProperty({ type: String })
  url: string;

  @ApiProperty({ type: String })
  key: string;

  @ApiProperty({ type: String })
  campaign_id: string | null;

  @ApiProperty({ type: String })
  created_by_id: string;

  @ApiProperty({ type: String, required: false })
  updated_by_id?: string;

  @ApiProperty({ type: Date, required: false })
  created_at: Date;

  @ApiProperty({ type: Date, required: false })
  updated_at: Date;

  public static from(dto: Partial<FileDto>) {
    const file = new FileDto();
    file.id = dto.id;
    file.name = dto.name;
    file.tags = dto.tags;
    file.mime_type = dto.mime_type;
    file.url = dto.url;
    file.key = dto.key;
    file.campaign_id = dto.campaign_id;
    file.created_by_id = dto.created_by_id;
    file.updated_by_id = dto.updated_by_id;
    file.created_at = dto.created_at;
    file.updated_at = dto.updated_at;
    return file;
  }

  public static fromEntity(entity: File) {
    return this.from({
      id: entity.id,
      name: entity.name,
      tags: entity.tags,
      mime_type: entity.mime_type,
      url: entity.url,
      key: entity.key,
      campaign_id: entity.campaign_id,
      created_by_id: entity.created_by_id,
      updated_by_id: entity.updated_by_id ? entity.updated_by_id : null,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }

  public static fromEntityForFileUser(entity: File) {
    return this.from({
      id: entity.id,
      name: entity.name,
      tags: entity.tags,
      mime_type: entity.mime_type,
      url: entity.url,
    });
  }

  public toEntity() {
    const file: File = null;
    file.id = this.id;
    file.tags = this.tags;
    file.name = this.name;
    file.mime_type = this.mime_type;
    file.url = this.url;
    file.key = this.key;
    file.campaign_id = this.campaign_id;
    file.created_by_id = this.created_by_id;
    file.updated_by_id = this.updated_by_id;
    file.created_at = this.created_at;
    file.updated_at = this.updated_at;
    return file;
  }
}
