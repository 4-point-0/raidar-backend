import { ApiProperty } from '@nestjs/swagger';
import { Provider, Role } from '../../../common/enums/enum';
import { User } from '../user.entity';

export class UserProfileDto {
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

  public static fromEntityUser(entity: User) {
    return this.from({
      id: entity.id,
      email: entity.email,
      first_name: entity.first_name,
      last_name: entity.last_name,
      roles: entity.roles,
      provider: entity.provider,
      provider_id: entity.provider_id,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    });
  }

  public static from(dto: Partial<UserProfileDto>) {
    const user = new UserProfileDto();
    user.id = dto.id;
    user.email = dto.email;
    user.first_name = dto.first_name;
    user.last_name = dto.last_name;
    user.roles = dto.roles;
    user.provider = dto.provider;
    user.provider_id = dto.provider_id;
    user.created_at = dto.created_at;
    user.updated_at = dto.updated_at;

    return user;
  }
}
