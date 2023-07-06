import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseDto {
  @ApiProperty({
    type: String,
  })
  id: string;

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
}
