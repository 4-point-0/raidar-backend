import {
  IsOptional,
  IsString,
  IsInt,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class SongFiltersDto {
  @IsOptional()
  @IsString()
  public title?: string;

  @IsOptional()
  @IsString()
  public artist?: string;

  @IsOptional()
  @IsInt()
  public minLength?: number;

  @IsOptional()
  @IsInt()
  public maxLength?: number;

  @IsOptional()
  @IsString()
  public genre?: string;

  @IsOptional()
  @IsArray()
  public mood?: string[];

  @IsOptional()
  @IsArray()
  public tags?: string[];

  @IsOptional()
  @IsInt()
  public minBpm?: number;

  @IsOptional()
  @IsInt()
  public maxBpm?: number;

  @IsOptional()
  @IsBoolean()
  public instrumental?: boolean;

  @IsOptional()
  @IsString()
  public musical_key?: string;

  @IsOptional()
  @IsInt()
  public take?: number;

  @IsOptional()
  @IsInt()
  public skip?: number;
}
