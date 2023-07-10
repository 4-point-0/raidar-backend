import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Role } from '../../../common/enums/enum';

export class CreateSongDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  title: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  album_id: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
  })
  genre: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
  })
  mood: string[];

  @IsOptional()
  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
  })
  tags: string[];

  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
  })
  length: number;

  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
  })
  bpm: number;

  @IsOptional()
  @ApiProperty({
    type: Boolean,
    required: false,
  })
  instrumental: boolean;

  @IsOptional()
  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
  })
  languages: string[];

  @IsOptional()
  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
  })
  vocal_ranges: string[];

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
  })
  musical_key: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  music_id: string;

  @IsOptional()
  @ApiProperty({
    type: Date,
    required: true,
  })
  recording_date: Date;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
  })
  recording_country: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
  })
  recording_location: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  art_id: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
  })
  pka: string;

  @IsNumber()
  @ApiProperty({
    type: Number,
    required: true,
  })
  price: number;

  user_id: string;
  roles: Role[];
}
