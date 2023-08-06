import { ApiProperty } from '@nestjs/swagger';

export class BuySongDto {
  @ApiProperty()
  songId: string;
  @ApiProperty()
  buyerId: string;
  @ApiProperty()
  txHash: string;
}
