import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from '../song/song.entity';
import { ServiceResult } from '../../helpers/response/result';
import {
  BadRequest,
  NotFound,
  ServerError,
} from '../../helpers/response/errors';
import { SongDto } from '../song/dto/song.dto';
import { Role } from '../../common/enums/enum';
import { findAllMarketplaceArtistSongs } from './queries/marketplace.queries';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { SongFiltersDto } from './dto/songs.filter.dto';
import { validate } from 'uuid';
import { findOneNotSoldSong } from '../song/queries/song.queries';
import { ConfigService } from '@nestjs/config';
import { CoingeckoService } from '../coingecko/coingecko.service';
import { mapPaginatedExtendedSongsDto } from './mapper/mapper';

@Injectable()
export class MarketplaceService {
  private readonly logger = new Logger(MarketplaceService.name);

  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    private readonly configService: ConfigService,
    private readonly coingeckoService: CoingeckoService,
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

      const storagePriceUsd =
        this.configService.get<number>('storage_cost_usd');

      const updatedSongs = await Promise.all(
        songs.map(async (songEntity) => {
          const songDto = SongDto.fromEntity(songEntity);

          const songPriceInUsd = await this.coingeckoService.convertNearToUsd(
            songEntity.price,
          );
          songDto.priceInUsd = songPriceInUsd
            ? songPriceInUsd.toString()
            : null;

          songDto.storagePriceUsd = storagePriceUsd
            ? storagePriceUsd.toString()
            : null;

          return songDto;
        }),
      );

      return new ServiceResult<PaginatedDto<SongDto>>(
        mapPaginatedExtendedSongsDto(updatedSongs, total, take, skip),
      );
    } catch (error) {
      this.logger.error('SongService - findAllMarketplaceArtistSongs', error);
      return new ServerError<PaginatedDto<SongDto>>(`Can't get artist songs`);
    }
  }

  async findOneSong(
    id: string,
    roles: Role[],
  ): Promise<ServiceResult<SongDto>> {
    try {
      if (![Role.Artist, Role.User].some((r) => roles.includes(r))) {
        return new BadRequest<SongDto>(
          `You don't have permission for this operation!`,
        );
      }

      if (!validate(id)) {
        return new NotFound<SongDto>(`Song not found!`);
      }

      const song = await this.songRepository.findOne(findOneNotSoldSong(id));
      if (!song) {
        return new NotFound<SongDto>(`Song not found!`);
      }

      const songDto = SongDto.fromEntity(song);
      const songPriceInUsd = await this.coingeckoService.convertNearToUsd(
        song.price,
      );
      songDto.priceInUsd = songPriceInUsd ? songPriceInUsd.toString() : null;
      const storagePriceUsd =
        this.configService.get<number>('storage_cost_usd');
      songDto.storagePriceUsd = storagePriceUsd
        ? storagePriceUsd.toString()
        : null;

      return new ServiceResult<SongDto>(songDto);
    } catch (error) {
      this.logger.error('SongService - findOneSong', error);
      return new ServerError<SongDto>(`Can't get song`);
    }
  }
}
