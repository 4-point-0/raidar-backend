import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto';
import { Listing } from '../listing.entity';
import { BaseDto } from '../../../common/dto/base.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nearAPI = require('near-api-js');

export class ListingDto extends BaseDto implements Readonly<ListingDto> {
  @ApiProperty({
    type: String,
  })
  id: string;

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
    type: String,
  })
  price_in_near: string;

  @ApiProperty({
    type: String,
  })
  price_in_near_formatted: string;

  public static from(dto: Partial<ListingDto>) {
    const listing = new ListingDto();
    listing.id = dto.id;
    listing.seller = dto.seller;
    listing.buyer = dto.buyer;
    listing.tx_hash = dto.tx_hash;
    listing.price = dto.price;
    listing.price_in_near = dto.price_in_near;
    listing.price_in_near_formatted = dto.price_in_near_formatted;
    listing.created_at = dto.created_at;
    listing.updated_at = dto.updated_at;
    listing.created_by_id = dto.created_by_id;
    listing.updated_by_id = dto.updated_by_id;
    return listing;
  }

  public static fromEntity(entity: Listing) {
    return this.from({
      id: entity.id,
      seller: UserDto.fromEntity(entity.seller),
      buyer: entity.buyer ? UserDto.fromEntity(entity.buyer) : null,
      tx_hash: entity.tx_hash,
      price: entity.price,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      created_by_id: entity.created_by_id,
      updated_by_id: entity.updated_by_id,
    });
  }

  public static fromEntityForMarketplace(entity: Listing, near_price: number) {
    const parsed_amount = nearAPI.utils.format.parseNearAmount(
      (entity.price / near_price).toString(),
    );
    return this.from({
      id: entity.id,
      seller: UserDto.fromEntity(entity.seller),
      buyer: entity.buyer ? UserDto.fromEntity(entity.buyer) : null,
      tx_hash: entity.tx_hash,
      price: entity.price,
      price_in_near: parsed_amount,
      price_in_near_formatted:
        nearAPI.utils.format.formatNearAmount(parsed_amount),
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      created_by_id: entity.created_by_id,
      updated_by_id: entity.updated_by_id,
    });
  }
}
