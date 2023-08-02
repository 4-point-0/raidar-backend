import { ApiProperty } from '@nestjs/swagger';

export class AlbumFilterDto {
  @ApiProperty({ type: Number, required: false })
  take?: number;

  @ApiProperty({ type: Number, required: false })
  skip?: number;

  @ApiProperty({ type: String, required: false })
  pka?: string;
}
