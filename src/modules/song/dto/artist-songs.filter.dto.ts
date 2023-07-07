import { ApiProperty } from '@nestjs/swagger';

export class ArtistSongsFilterDto {
  @ApiProperty({ type: String, required: false })
  title?: string;

  @ApiProperty({ type: Number, required: false })
  take?: number;

  @ApiProperty({ type: Number, required: false })
  skip?: number;
}
