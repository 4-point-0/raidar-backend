import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
    type: String,
  })
  sold_price: string;

  @ApiPropertyOptional({
    type: String,
  })
  sold_price_in_near_formatted?: string;

  public static from(dto: Partial<LicenceDto>) {
    const licence = new LicenceDto();
    licence.id = dto.id;
    licence.seller = dto.seller;
    licence.buyer = dto.buyer;
    licence.tx_hash = dto.tx_hash;
    licence.sold_price = dto.sold_price;
    licence.sold_price_in_near_formatted = dto.sold_price_in_near_formatted;
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
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      created_by_id: entity.created_by_id,
      updated_by_id: entity.updated_by_id,
    });
  }

  public static fromEntityForUserSongs(entity: Licence) {
    return this.from({
      id: entity.id,
      seller: UserDto.fromEntity(entity.seller),
      buyer: entity.buyer ? UserDto.fromEntity(entity.buyer) : null,
      tx_hash: entity.tx_hash,
      sold_price: entity.sold_price,
      sold_price_in_near_formatted: nearAPI.utils.format.formatNearAmount(
        entity.sold_price,
      ),
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      created_by_id: entity.created_by_id,
      updated_by_id: entity.updated_by_id,
    });
  }
}
