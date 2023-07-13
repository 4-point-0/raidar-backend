import {
  IsOptional,
  IsString,
  IsInt,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SongFiltersDto {
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  public title?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  public artist?: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  public minLength?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  public maxLength?: number;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  public genre?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  public mood?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  public tags?: string[];

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  public minBpm?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  public maxBpm?: number;

  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  public instrumental?: boolean;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  public musical_key?: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  public take?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  public skip?: number;
}
