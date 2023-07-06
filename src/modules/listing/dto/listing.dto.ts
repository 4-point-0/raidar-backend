import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto';
import { Listing } from '../listing.entity';
import { SongDto } from '../../../modules/song/dto/song.dto';

export class ListingDto implements Readonly<ListingDto> {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: UserDto,
  })
  song: SongDto;

  @ApiProperty({
    type: UserDto,
  })
  seller: UserDto;

  @ApiProperty({
    type: UserDto,
  })
  buyer: UserDto;

  @ApiProperty({
    type: String,
  })
  tx_hash: string;

  @ApiProperty({
    type: Number,
  })
  price: number;

  @ApiProperty({
    type: Date,
  })
  created_at: Date;

  @ApiProperty({
    type: Date,
  })
  updated_at: Date;

  @ApiProperty({
    type: String,
  })
  created_by_id: string;

  @ApiProperty({
    type: String,
  })
  updated_by_id: string;

  public static from(dto: Partial<ListingDto>) {
    const listing = new ListingDto();
    listing.id = dto.id;
    listing.seller = dto.seller;
    listing.buyer = dto.buyer;
    listing.tx_hash = dto.tx_hash;
    listing.price = dto.price;
    listing.created_at = dto.created_at;
    listing.updated_at = dto.updated_at;
    listing.created_by_id = dto.created_by_id;
    listing.updated_by_id = dto.updated_by_id;
    return listing;
  }

  public static fromEntity(entity: Listing) {
    return this.from({
      id: entity.id,
      song: SongDto.fromEntity(entity.song),
      seller: UserDto.fromEntity(entity.seller),
      buyer: UserDto.fromEntity(entity.buyer),
      tx_hash: entity.tx_hash,
      price: entity.price,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      created_by_id: entity.created_by_id,
      updated_by_id: entity.updated_by_id,
    });
  }
}
