import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Song } from '../song.entity';
import { FileDto } from '../../../modules/file/dto/file.dto';
import { BaseDto } from '../../../common/dto/base.dto';
import { SongAlbumDto } from './song-album.dto';
import { LicenceDto } from '../../../modules/licence/dto/licence.dto';

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

  @ApiProperty({
    type: String,
  })
  price: number;

  @ApiPropertyOptional({
    type: LicenceDto,
    nullable: true,
  })
  licence?: LicenceDto;

  @ApiProperty({
    type: Number,
  })
  token_contract_id: number;

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
    song.music = dto.music;
    song.art = dto.art;
    song.album = dto.album;
    song.price = dto.price;
    song.token_contract_id = dto.token_contract_id;

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
      price: entity.price,
      token_contract_id: entity.token_contract_id,
      music: FileDto.fromEntity(entity.music),
      art: FileDto.fromEntity(entity.art),
      album: entity.album ? SongAlbumDto.fromEntity(entity.album) : null,
    });
  }

  public static fromEntityWithLicence(entity: Song) {
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
      price: entity.price,
      music: FileDto.fromEntity(entity.music),
      art: FileDto.fromEntity(entity.art),
      //Ovaj LicenceDto.fromEntityForUserSongs vrati dobru vrijednost ali ga nemre assignat na licence
      licence:
        entity.licences && entity.licences.length > 0
          ? LicenceDto.fromEntityForUserSongs(entity.licences[0])
          : null,
      album: entity.album ? SongAlbumDto.fromEntity(entity.album) : null,
    });
  }
}

export class ExtendedSongDto extends SongDto {
  priceInUsd: string;
  storagePriceUsd: number;

  constructor(songDto: SongDto, priceInUsd: string, storagePriceUsd: number) {
    super();
    Object.assign(this, songDto);
    this.priceInUsd = priceInUsd;
    this.storagePriceUsd = storagePriceUsd;
  }

  public static fromSongDto(
    songDto: SongDto,
    priceInUsd: string,
    storagePriceUsd: number,
  ) {
    return new ExtendedSongDto(songDto, priceInUsd, storagePriceUsd);
  }
}
