import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Song } from '../song.entity';
import { FileDto } from '../../../modules/file/dto/file.dto';
import { BaseDto } from '../../../common/dto/base.dto';
import { ListingDto } from '../../../modules/listing/dto/listing.dto';
import { Listing } from '../../listing/listing.entity';
import { SongAlbumDto } from './song-album.dto';

export class SongDto extends BaseDto implements Readonly<SongDto> {
  @ApiProperty({
    type: String,
  })
  user_id: string;

  @ApiPropertyOptional({
    type: SongAlbumDto,
    nullable: true,
  })
  album?: SongAlbumDto;

  @ApiProperty({
    type: String,
  })
  title: string;

  @ApiProperty({
    type: String,
  })
  length: number;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
  })
  genre?: string;

  @ApiProperty({
    type: String,
    isArray: true,
  })
  mood: string[];

  @ApiProperty({
    type: String,
    isArray: true,
  })
  tags: string[];

  @ApiPropertyOptional({
    type: String,
    nullable: true,
  })
  bpm?: number;

  @ApiPropertyOptional({
    type: Boolean,
    nullable: true,
  })
  instrumental?: boolean;

  @ApiProperty({
    type: String,
    isArray: true,
  })
  languages: string[];

  @ApiProperty({
    type: String,
    isArray: true,
  })
  vocal_ranges: string[];

  @ApiPropertyOptional({
    type: String,
    nullable: true,
  })
  musical_key?: string;

  @ApiProperty({
    type: FileDto,
    nullable: false,
  })
  music: FileDto;

  @ApiProperty({
    type: Date,
  })
  recording_date: Date;

  @ApiProperty({
    type: String,
  })
  recording_country: string;

  @ApiProperty({
    type: String,
  })
  recording_location: string;

  @ApiProperty({
    type: FileDto,
    nullable: false,
  })
  art: FileDto;

  @ApiProperty({
    type: String,
  })
  pka: string;

  @ApiPropertyOptional({
    type: ListingDto,
  })
  last_listing?: ListingDto;

  public static from(dto: Partial<SongDto>) {
    const song = new SongDto();
    song.id = dto.id;
    song.user_id = dto.user_id;
    song.title = dto.title;
    song.length = dto.length;
    song.genre = dto.genre;
    song.mood = dto.mood;
    song.tags = dto.tags;
    song.bpm = dto.bpm;
    song.instrumental = dto.instrumental;
    song.languages = dto.languages;
    song.vocal_ranges = dto.vocal_ranges;
    song.musical_key = dto.musical_key;
    song.recording_date = dto.recording_date;
    song.recording_location = dto.recording_location;
    song.recording_country = dto.recording_country;
    song.pka = dto.pka;
    song.last_listing = dto.last_listing;
    song.music = dto.music;
    song.art = dto.art;
    song.album = dto.album;

    return song;
  }

  public static fromEntity(entity: Song) {
    return this.from({
      id: entity.id,
      user_id: entity.user.id,
      title: entity.title,
      length: entity.length,
      genre: entity.genre,
      mood: entity.mood,
      tags: entity.tags,
      bpm: entity.bpm,
      instrumental: entity.instrumental,
      languages: entity.languages,
      vocal_ranges: entity.vocal_ranges,
      musical_key: entity.musical_key,
      recording_date: entity.recording_date,
      recording_location: entity.recording_location,
      recording_country: entity.recording_country,
      pka: entity.pka,
      music: FileDto.fromEntity(entity.music),
      art: FileDto.fromEntity(entity.art),
      album: entity.album ? SongAlbumDto.fromEntity(entity.album) : null,
      last_listing: ListingDto.fromEntity(
        entity.listings.sort((a: Listing, b: Listing) => {
          return b.created_at.getTime() - a.created_at.getTime();
        })[0],
      ),
    });
  }

  public static fromEntityForMarketplace(entity: Song, near_price: number) {
    return this.from({
      id: entity.id,
      user_id: entity.user.id,
      title: entity.title,
      length: entity.length,
      genre: entity.genre,
      mood: entity.mood,
      tags: entity.tags,
      bpm: entity.bpm,
      instrumental: entity.instrumental,
      languages: entity.languages,
      vocal_ranges: entity.vocal_ranges,
      musical_key: entity.musical_key,
      recording_date: entity.recording_date,
      recording_location: entity.recording_location,
      recording_country: entity.recording_country,
      pka: entity.pka,
      music: FileDto.fromEntity(entity.music),
      art: FileDto.fromEntity(entity.art),
      album: entity.album ? SongAlbumDto.fromEntity(entity.album) : null,
      last_listing: ListingDto.fromEntityForMarketplace(
        entity.listings.sort((a: Listing, b: Listing) => {
          return b.created_at.getTime() - a.created_at.getTime();
        })[0],
        near_price,
      ),
    });
  }
}
