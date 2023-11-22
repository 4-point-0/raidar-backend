import { ApiProperty } from '@nestjs/swagger';

export class CreateContractDto {
  @ApiProperty({
    type: 'string',
    description: 'ID of the song associated with the contract',
    required: true,
  })
  songId: string;
}
