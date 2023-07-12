import { ApiProperty } from '@nestjs/swagger';
import { Provider, Role } from '../../../common/enums/enum';
import { User } from '../user.entity';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty({
    enum: [Role.User, Role.Artist],
    default: Role.User,
  })
  roles: Role[];

  @ApiProperty({
    enum: [Provider.Google],
    default: Provider.Google,
    required: false,
  })
  provider?: Provider;

  @ApiProperty({
    required: false,
  })
  provider_id?: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  wallet_address: string;

  public static fromEntity(entity: User) {
    return {
      id: entity.id,
      email: entity.email,
      first_name: entity.first_name,
      last_name: entity.last_name,
      roles: entity.roles,
      provider: entity.provider,
      provider_id: entity.provider_id,
      wallet_address: entity.wallet_address,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
