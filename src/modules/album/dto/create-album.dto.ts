import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
  })
  public title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    required: false,
  })
  public pka: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  public cover_id: string;
}
