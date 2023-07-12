import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PriceDto {
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    required: true,
  })
  price: number;
}
