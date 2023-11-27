import { ApiProperty } from '@nestjs/swagger';
import { Contract } from '../contract.entity';
import { BaseDto } from '../../../common/dto/base.dto';

export class ContractDto extends BaseDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  id: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  artistId: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'ID of the customer who purchased the song, if applicable',
  })
  customerId?: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  songId: string;

  @ApiProperty({
    type: String,
    required: true,
    description:
      'URL to the PDF of the contract. Initially signed by the artist, later can be the version signed by the customer.',
  })
  pdfUrl: string;

  public static from(dto: Partial<ContractDto>) {
    const contractDto = new ContractDto();
    contractDto.id = dto.id;
    contractDto.artistId = dto.artistId;
    contractDto.customerId = dto.customerId;
    contractDto.songId = dto.songId;
    contractDto.pdfUrl = dto.pdfUrl;
    contractDto.created_at = dto.created_at;
    contractDto.updated_at = dto.updated_at;
    contractDto.created_by_id = dto.created_by_id;
    contractDto.updated_by_id = dto.updated_by_id;
    return contractDto;
  }

  public static fromEntity(entity: Contract) {
    return this.from({
      id: entity.id,
      artistId: entity.artist.id,
      customerId: entity.customer?.id,
      songId: entity.song.id,
      pdfUrl: entity.pdfUrl,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      created_by_id: entity.created_by_id,
      updated_by_id: entity.updated_by_id,
    });
  }
}
