import { PaginatedDto } from '../../../common/pagination/paginated-dto';
import { Album } from '../../../modules/album/album.entity';
import { File } from '../../../modules/file/file.entity';
import { User } from '../../../modules/user/user.entity';
import { CreateSongDto } from '../dto/create-song.dto';
import { SongDto } from '../dto/song.dto';
import { Song } from '../song.entity';

export const createSongMapper = (
  dto: CreateSongDto,
  user: User,
  album: Album,
  music_file: File,
  art_file: File,
): Partial<Song> => {
  return {
    title: dto.title,
    user: user,
    album: album,
    music: music_file,
    art: art_file,
    genre: dto.genre,
    mood: dto.mood,
    tags: dto.tags,
    length: dto.length,
    bpm: dto.bpm,
    instrumental: dto.instrumental,
    languages: dto.languages,
    vocal_ranges: dto.vocal_ranges,
    musical_key: dto.musical_key,
    recording_date: dto.recording_date,
    recording_country: dto.recording_country,
    recording_location: dto.recording_location,
    pka: dto.pka,
  };
};

export const mapPaginatedSongsDto = (
  songs: Song[],
  total: number,
  take?: number,
  skip?: number,
): PaginatedDto<SongDto> => {
  const songDtos: SongDto[] = [];
  for (const song of songs) {
    songDtos.push(SongDto.fromEntity(song));
  }

  return {
    total: total,
    take: Number(take),
    skip: Number(skip),
    count: songDtos.length,
    results: songDtos,
  };
};
