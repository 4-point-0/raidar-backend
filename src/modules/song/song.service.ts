import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { ServiceResult } from '../../helpers/response/result';
import {
  BadRequest,
  Forbidden,
  NotFound,
  ServerError,
} from '../../helpers/response/errors';
import { SongDto } from './dto/song.dto';
import { File } from '../file/file.entity';
import { User } from '../user/user.entity';
import { Album } from '../album/album.entity';
import { createSongMapper, mapPaginatedSongsDto } from './mappers/song.mappers';
import { Listing } from '../listing/listing.entity';
import { createListingMapper } from '../listing/mappers/listing.mappers';
import { Role } from '../../common/enums/enum';
import { validate } from 'uuid';
import {
  findAllArtistSongs,
  findAllUserSongs,
  findOneSong,
} from './queries/song.queries';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { ArtistSongsFilterDto } from './dto/artist-songs.filter.dto';
import { SongFiltersDto } from './dto/songs.filter.dto';

@Injectable()
export class SongService {
  private readonly logger = new Logger(SongService.name);

  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Listing)
    private listingRepository: Repository<Listing>,
  ) {}

  async createSong(dto: CreateSongDto): Promise<ServiceResult<SongDto>> {
    try {
      if (!dto.roles.includes(Role.Artist)) {
        return new Forbidden<SongDto>(`You are not allowed to create a song!`);
      }

      if (!dto.title) {
        return new BadRequest<SongDto>(`Title is required`);
      }

      if (!dto.album_id) {
        return new BadRequest<SongDto>(`Album is required`);
      }

      const album = await this.albumRepository.findOneBy({ id: dto.album_id });

      if (!album) {
        return new NotFound<SongDto>(`Album not found!`);
      }

      if (!dto.music_id) {
        return new BadRequest<SongDto>(`Music id is required`);
      }

      const music_file = await this.fileRepository.findOneBy({
        id: dto.music_id,
      });

      if (!music_file) {
        return new NotFound<SongDto>(`Music file not found!`);
      }

      const art_file = await this.fileRepository.findOneBy({
        id: dto.art_id,
      });

      if (!art_file) {
        return new NotFound<SongDto>(`Art file not found!`);
      }

      const user = await this.userRepository.findOneBy({ id: dto.user_id });

      const new_song = this.songRepository.create(
        createSongMapper(dto, user, album, music_file, art_file),
      );

      await this.songRepository.save(new_song);

      const listing = this.listingRepository.create(
        createListingMapper(dto.price, new_song, user),
      );

      await this.listingRepository.save(listing);

      const song = await this.songRepository.findOne(findOneSong(new_song.id));

      return new ServiceResult<SongDto>(SongDto.fromEntity(song));
    } catch (error) {
      this.logger.error('SongService - createSong', error);
      return new ServerError<SongDto>(`Can't create song`);
    }
  }

  async findOne(id: string, roles: Role[]): Promise<ServiceResult<SongDto>> {
    try {
      if (![Role.Artist, Role.User].some((r) => roles.includes(r))) {
        return new BadRequest<SongDto>(
          `You don't have permission for this operation!`,
        );
      }

      if (!validate(id)) {
        return new NotFound<SongDto>(`Song not found!`);
      }

      const song = await this.songRepository.findOne(findOneSong(id));

      if (!song) {
        return new NotFound<SongDto>(`Song not found!`);
      }

      return new ServiceResult<SongDto>(SongDto.fromEntity(song));
    } catch (error) {
      this.logger.error('SongService - findOneSong', error);
      return new ServerError<SongDto>(`Can't get song`);
    }
  }

  async findAllArtistSongs(
    user_id: string,
    roles: Role[],
    filters: SongFiltersDto,
  ): Promise<ServiceResult<PaginatedDto<SongDto>>> {
    try {
      if (!roles.includes(Role.Artist)) {
        return new BadRequest<PaginatedDto<SongDto>>(
          `You don't have permission for this operation!`,
        );
      }

      const take = filters.take || undefined;
      const skip = filters.skip || 0;

      // Create the parameters
      const params = {
        title: filters.title,
        artist: filters.artist,
        minLength: filters.minLength,
        maxLength: filters.maxLength,
        genre: filters.genre,
        mood: filters.mood,
        tags: filters.tags,
        minBpm: filters.minBpm,
        maxBpm: filters.maxBpm,
        instrumental: filters.instrumental,
        musical_key: filters.musical_key,
      };

      // Create the query
      const query = findAllArtistSongs(params, user_id, take, skip);

      // Execute the query
      const [result, total] = await this.songRepository
        .createQueryBuilder('song')
        .leftJoinAndSelect('song.user', 'user')
        .leftJoinAndSelect('song.album', 'album')
        .leftJoinAndSelect('song.music', 'music')
        .leftJoinAndSelect('song.art', 'art')
        .leftJoinAndSelect('song.listings', 'listing')
        .where(query)
        .take(take)
        .skip(skip)
        .getManyAndCount();

      return new ServiceResult<PaginatedDto<SongDto>>(
        mapPaginatedSongsDto(result, total, take, skip),
      );
    } catch (error) {
      this.logger.error('SongService - findAllArtistSongs', error);
      return new ServerError<PaginatedDto<SongDto>>(`Can't get artist songs`);
    }
  }

  async findAllUserSongs(
    user_id: string,
    roles: Role[],
    query: ArtistSongsFilterDto,
  ): Promise<ServiceResult<PaginatedDto<SongDto>>> {
    try {
      if (!roles.includes(Role.User)) {
        return new BadRequest<PaginatedDto<SongDto>>(
          `You don't have permission for this operation!`,
        );
      }

      const take = query.take || undefined;
      const skip = query.skip || 0;
      const title = query.title || '';

      const [result, total] = await this.songRepository.findAndCount(
        findAllUserSongs(title, user_id, take, skip),
      );

      return new ServiceResult<PaginatedDto<SongDto>>(
        mapPaginatedSongsDto(result, total, take, skip),
      );
    } catch (error) {
      this.logger.error('SongService - findAllUserSongs', error);
      console.log(error);
      return new ServerError<PaginatedDto<SongDto>>(`Can't get user songs`);
    }
  }
}