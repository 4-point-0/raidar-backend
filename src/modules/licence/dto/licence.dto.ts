import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto';
import { Licence } from '../licence.entity';
import { BaseDto } from '../../../common/dto/base.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nearAPI = require('near-api-js');

export class LicenceDto extends BaseDto implements Readonly<LicenceDto> {
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

  public static from(dto: Partial<LicenceDto>) {
    const licence = new LicenceDto();
    licence.id = dto.id;
    licence.seller = dto.seller;
    licence.buyer = dto.buyer;
    licence.tx_hash = dto.tx_hash;
    licence.price = dto.price;
    licence.price_in_near = dto.price_in_near;
    licence.price_in_near_formatted = dto.price_in_near_formatted;
    licence.created_at = dto.created_at;
    licence.updated_at = dto.updated_at;
    licence.created_by_id = dto.created_by_id;
    licence.updated_by_id = dto.updated_by_id;
    return licence;
  }

  public static fromEntity(entity: Licence) {
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

  public static fromEntityForMarketplace(entity: Licence, near_price: number) {
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
