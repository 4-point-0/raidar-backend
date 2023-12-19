import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty()
  songId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  priceId: string;
}
