import { Inject, Injectable, Logger } from '@nestjs/common';
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
import {
  createSongMapper,
  mapPaginatedSongsDto,
  mapPaginatedUserSongsDto,
} from './mappers/song.mappers';
import { Licence } from '../licence/licence.entity';
import { Role } from '../../common/enums/enum';
import { validate } from 'uuid';
import {
  findAllArtistSongs,
  findAllUserSongs,
  findOneSong,
  findSongByTokenContractId,
  findSongWithUser,
} from './queries/song.queries';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { ArtistSongsFilterDto } from './dto/artist-songs.filter.dto';
import { MIME_TYPE_WAV } from '../../common/constants';
import { BuySongDto } from './dto/buy-song.dto';
import { LicenceDto } from '../licence/dto/licence.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { songDownloadTemplate } from '../../common/email-templates/song-dowload-template';
import { songBoughtTemplate } from '../../common/email-templates/song-bought-notif-template';
import { CoingeckoService } from '../coingecko/coingecko.service';
import { StripeService } from '../stripe/stripe.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nearAPI = require('near-api-js');

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
    @InjectRepository(Licence)
    private licenceRepository: Repository<Licence>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly coingeckoService: CoingeckoService,
    private readonly stripeService: StripeService,
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

      if (!dto.price) {
        return new BadRequest<SongDto>(`Price is required`);
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

      if (music_file.mime_type !== MIME_TYPE_WAV) {
        return new BadRequest<SongDto>(`Music file must be of type wav`);
      }

      const art_file = await this.fileRepository.findOneBy({
        id: dto.art_id,
      });

      if (!art_file) {
        return new NotFound<SongDto>(`Art file not found!`);
      }

      const user = await this.userRepository.findOneBy({ id: dto.user_id });

      if (!user) {
        return new NotFound<SongDto>(`User not found!`);
      }

      const stripePrice = await this.stripeService.createPrice(dto.price);
      if (!stripePrice) {
        throw new Error('Failed to create price in Stripe');
      }

      const priceInNear = await this.coingeckoService.convertUsdToNear(
        dto.price,
      );
      dto.price = priceInNear;

      const new_song = this.songRepository.create(
        createSongMapper(dto, user, album, music_file, art_file),
      );
      new_song.price_id = stripePrice.id;
      await this.songRepository.save(new_song);

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

      song.price = await this.coingeckoService.convertNearToUsd(song.price);

      return new ServiceResult<SongDto>(SongDto.fromEntity(song));
    } catch (error) {
      this.logger.error('SongService - findOneSong', error);
      return new ServerError<SongDto>(`Can't get song`);
    }
  }

  async findAllArtistSongs(
    user_id: string,
    roles: Role[],
    query: ArtistSongsFilterDto,
  ): Promise<ServiceResult<PaginatedDto<SongDto>>> {
    try {
      if (!roles.includes(Role.Artist)) {
        return new BadRequest<PaginatedDto<SongDto>>(
          `You don't have permission for this operation!`,
        );
      }

      const take = query.take || 10;
      const skip = query.skip || 0;
      const title = query.title || '';

      const [result, total] = await this.songRepository.findAndCount(
        findAllArtistSongs(title, user_id, take, skip),
      );
      for (const song of result) {
        song.price = await this.coingeckoService.convertNearToUsd(song.price);
      }
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

      const take = query.take || 10;
      const skip = query.skip || 0;
      const title = query.title || '';

      const [result, total] = await this.songRepository.findAndCount(
        findAllUserSongs(title, user_id, take, skip),
      );
      for (const song of result) {
        song.price = await this.coingeckoService.convertNearToUsd(song.price);
      }
      return new ServiceResult<PaginatedDto<SongDto>>(
        mapPaginatedUserSongsDto(result, total, take, skip),
      );
    } catch (error) {
      this.logger.error('SongService - findAllUserSongs', error);
      return new ServerError<PaginatedDto<SongDto>>(`Can't get user songs`);
    }
  }

  async buySong(dto: BuySongDto): Promise<ServiceResult<LicenceDto>> {
    try {
      const songQuery = findSongWithUser(dto.songId);
      const song = await this.songRepository.findOne(songQuery);

      if (!song) {
        return new NotFound<LicenceDto>(`Song not found`);
      }

      const buyer = await this.userRepository.findOne({
        where: { id: dto.buyerId },
      });

      if (!buyer) {
        return new NotFound<LicenceDto>(`Buyer not found!`);
      }

      const existingLicence = await this.licenceRepository.findOne({
        where: { song: { id: song.id }, buyer: { id: buyer.id } },
      });

      if (existingLicence) {
        return new BadRequest<LicenceDto>(
          `Buyer already owns a licence for this song!`,
        );
      }

      const seller = await this.userRepository.findOne({
        where: { id: song.user.id },
      });

      if (!seller) {
        return new NotFound<LicenceDto>(`Seller not found!`);
      }

      const licence = this.licenceRepository.create();
      licence.song = song;
      licence.seller = seller;
      licence.buyer = buyer;
      licence.tx_hash = dto.txHash;

      const near_usd = await this.cacheManager.get<string>('near-usd');
      licence.sold_price = nearAPI.utils.format.parseNearAmount(
        (song.price / Number(near_usd)).toString(),
      );

      await this.licenceRepository.save(licence);

      const licenceDto = LicenceDto.fromEntity(licence);

      await this.emailService.send({
        to: buyer.email,
        from: this.configService.get('sendgrid.email'),
        subject: 'Download Your Raidar Song',
        html: songDownloadTemplate(song.title, song.music.url),
      });

      await this.emailService.send({
        to: seller.email,
        from: this.configService.get('sendgrid.email'),
        subject: 'Your Song Has Been Sold',
        html: songBoughtTemplate(song.title),
      });

      return new ServiceResult<LicenceDto>(licenceDto);
    } catch (error) {
      this.logger.error('SongService - buySong', error);
      return new ServerError<LicenceDto>(`Can't purchase song`);
    }
  }

  async getSongMedia(
    token_contract_id: string,
  ): Promise<ServiceResult<string>> {
    try {
      const song = await this.songRepository.findOne(
        findSongByTokenContractId(token_contract_id),
      );

      if (!song) {
        return new NotFound<string>(`Song not found`);
      }

      return new ServiceResult<string>(song.art.url);
    } catch (error) {
      this.logger.error('SongService - getSongMedia', error);
      return new ServerError<string>(`Can't get song media`);
    }
  }
}
