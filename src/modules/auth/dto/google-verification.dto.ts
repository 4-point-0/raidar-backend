import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { Role } from '../../../common/enums/enum';

export class GoogleVerificationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  token: string;

  @ApiProperty({
    enum: [Role.Artist, Role.User],
    required: true,
  })
  role: Role;
}

export default GoogleVerificationDto;
