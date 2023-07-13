import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from '../song/song.entity';
import { ServiceResult } from '../../helpers/response/result';
import { BadRequest, ServerError } from '../../helpers/response/errors';
import { SongDto } from '../song/dto/song.dto';
import { mapPaginatedSongsDto } from '../song/mappers/song.mappers';
import { Role } from '../../common/enums/enum';
import { findAllMarketplaceArtistSongs } from './queries/marketplace.queries';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { SongFiltersDto } from './dto/songs.filter.dto';

@Injectable()
export class MarketplaceService {
  private readonly logger = new Logger(MarketplaceService.name);

  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async findAll(
    roles: Role[],
    filters: SongFiltersDto,
  ): Promise<ServiceResult<PaginatedDto<SongDto>>> {
    try {
      if (!(roles.includes(Role.Artist) || roles.includes(Role.User))) {
        return new BadRequest<PaginatedDto<SongDto>>(
          `You don't have permission for this operation!`,
        );
      }

      const take = filters.take || 10;
      const skip = filters.skip || 0;

      const query = {
        title: filters.title || undefined,
        artist: filters.artist || undefined,
        minLength: filters.minLength || undefined,
        maxLength: filters.maxLength || undefined,
        genre: filters.genre || undefined,
        mood: filters.mood || undefined,
        tags: filters.tags || undefined,
        minBpm: filters.minBpm || undefined,
        maxBpm: filters.maxBpm || undefined,
        instrumental: filters.instrumental || undefined,
        musical_key: filters.musical_key || undefined,
      };

      const result = await findAllMarketplaceArtistSongs(
        this.songRepository,
        query,
        take,
        skip,
      );

      const songs = result.songs;
      const total = result.count;

      return new ServiceResult<PaginatedDto<SongDto>>(
        mapPaginatedSongsDto(songs, total, take, skip),
      );
    } catch (error) {
      this.logger.error('SongService - findAllMarketplaceArtistSongs', error);
      return new ServerError<PaginatedDto<SongDto>>(`Can't get artist songs`);
    }
  }
}
