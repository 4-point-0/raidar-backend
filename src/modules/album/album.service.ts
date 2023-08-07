import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './album.entity';
import { Repository } from 'typeorm';
import { CreateAlbumDto } from './dto/create-album.dto';
import { ServiceResult } from '../../helpers/response/result';
import {
  BadRequest,
  Forbidden,
  NotFound,
  ServerError,
} from '../../helpers/response/errors';
import { AlbumDto } from './dto/album.dto';
import { File } from '../../modules/file/file.entity';
import { Role } from 'src/common/enums/enum';
import {
  findAllAlbumsQuery,
  findAllArtistAlbumsQuery,
  findOneAlbumQuery,
} from './queries/album-queries';
import { AlbumFilterDto } from './dto/album-filter.dto';
import { mapPaginatedAlbums } from './mappers/album.mappers';
import { PaginatedDto } from '../../common/pagination/paginated-dto';

@Injectable()
export class AlbumService {
  private readonly logger = new Logger(AlbumService.name);

  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async create(
    dto: CreateAlbumDto,
    creatorId: string,
    roles: Role[],
  ): Promise<ServiceResult<AlbumDto>> {
    try {
      if (!roles.includes(Role.Artist)) {
        return new Forbidden<AlbumDto>(
          `You don't have permission for this operation!`,
        );
      }
      const album = new Album();
      album.title = dto.title;
      album.pka = dto.pka;

      const cover = await this.fileRepository.findOneBy({ id: dto.cover_id });

      if (!cover) {
        return new BadRequest('Cover image not found!');
      }

      album.cover = cover;
      album.created_by_id = creatorId;
      album.updated_by_id = creatorId;

      await this.albumRepository.save(album);

      return new ServiceResult<AlbumDto>(AlbumDto.fromEntity(album));
    } catch (error) {
      this.logger.error('AlbumService - create', error);
      return new ServerError<AlbumDto>(`Can't create album`);
    }
  }

  async findOne(id: string): Promise<ServiceResult<AlbumDto>> {
    try {
      const album = await this.albumRepository.findOne(findOneAlbumQuery(id));

      if (!album) return new NotFound('Album not found');

      return new ServiceResult<AlbumDto>(AlbumDto.fromEntity(album));
    } catch (error) {
      this.logger.error('AlbumService - findOne', error);
      return new ServerError<AlbumDto>(`Can't get album`);
    }
  }

  async findAll(
    roles: Role[],
    query: AlbumFilterDto,
  ): Promise<ServiceResult<PaginatedDto<AlbumDto>>> {
    try {
      if (!roles.includes(Role.Artist)) {
        return new Forbidden<PaginatedDto<AlbumDto>>(
          `You don't have permission for this operation!`,
        );
      }
      const take = query.take || 10;
      const skip = query.skip || 0;

      const [result, total] = await this.albumRepository.findAndCount(
        findAllAlbumsQuery(take, skip),
      );

      return new ServiceResult<PaginatedDto<AlbumDto>>(
        mapPaginatedAlbums(result, total, take, skip),
      );
    } catch (error) {
      this.logger.error('AlbumService - findAll', error);
      return new ServerError<PaginatedDto<AlbumDto>>(`Can't get albums`);
    }
  }

  async findAllArtistAlbums(
    roles: Role[],
    creatorId: string,
    query: AlbumFilterDto,
  ): Promise<ServiceResult<PaginatedDto<AlbumDto>>> {
    try {
      if (!roles.includes(Role.Artist)) {
        return new Forbidden<PaginatedDto<AlbumDto>>(
          `You don't have permission for this operation!`,
        );
      }
      const take = query.take || 10;
      const skip = query.skip || 0;

      const [result, total] = await this.albumRepository.findAndCount(
        findAllArtistAlbumsQuery(take, skip, creatorId),
      );

      return new ServiceResult<PaginatedDto<AlbumDto>>(
        mapPaginatedAlbums(result, total, take, skip),
      );
    } catch (error) {
      this.logger.error('AlbumService - findAll', error);
      return new ServerError<PaginatedDto<AlbumDto>>(`Can't get albums`);
    }
  }
}
