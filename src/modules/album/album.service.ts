import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './album.entity';
import { Repository } from 'typeorm';
import { CreateAlbumDto } from './dto/create-album.dto';
import { ServiceResult } from 'src/helpers/response/result';
import {
  BadRequest,
  NotFound,
  ServerError,
} from '../../helpers/response/errors';
import { AlbumDto } from './dto/album.dto';
import { File } from '../../modules/file/file.entity';
import { Role } from 'src/common/enums/enum';

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
    role: Role,
  ): Promise<ServiceResult<AlbumDto>> {
    try {
      if (!role.includes(Role.Artist)) {
        return new BadRequest<AlbumDto>(
          `You don't have permission for this operation!`,
        );
      }
      const album = new Album();
      album.title = dto.title;
      album.pka = dto.pka;

      const image = await this.fileRepository.findOneBy({ id: dto.imageId });

      if (!image) {
        return new BadRequest('Image not found!');
      }

      album.image = image;
      album.created_by_id = creatorId;
      album.updated_by_id = creatorId;

      await this.albumRepository.save(album);

      return new ServiceResult<AlbumDto>(AlbumDto.fromEntity(album));
    } catch (error) {
      this.logger.error('AlbumService - create', error);
      return new ServerError<AlbumDto>(`Can't create album`);
    }
  }

  async getAlbum(albumId: string): Promise<ServiceResult<AlbumDto>> {
    try {
      const album = await this.albumRepository.findOne({
        where: {
          id: albumId,
        },
        relations: {
          image: true,
        },
      });

      if (!album) return new NotFound('Album not found');

      return new ServiceResult<AlbumDto>(AlbumDto.fromEntity(album));
    } catch (error) {
      this.logger.error('AlbumService - getAlbum', error);
      return new ServerError<AlbumDto>(`Can't get album`);
    }
  }

  async getAll(): Promise<ServiceResult<AlbumDto[]>> {
    try {
      const albums = await this.albumRepository.find({
        relations: {
          image: true,
        },
      });
      return new ServiceResult<AlbumDto[]>(
        albums.map((album) => AlbumDto.fromEntity(album)),
      );
    } catch (error) {
      this.logger.error('AlbumService - getAll', error);
      return new ServerError<AlbumDto[]>(`Can't get albums`);
    }
  }
}
