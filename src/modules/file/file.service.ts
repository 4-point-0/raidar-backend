import { Injectable, Logger } from '@nestjs/common';
import { ServiceResult } from '../../helpers/response/result';
import { NotFound, ServerError } from '../../helpers/response/errors';
import { FileDto } from './dto/file.dto';
import { File } from './file.entity';
import { AwsStorageService } from './aws-storage.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from '../song/song.entity';
import { MIME_TYPE_WAV } from '../../common/constants';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    private readonly awsStorageService: AwsStorageService,
  ) {}

  async uploadFile(
    dataBuffer: Buffer,
    fileName: string,
    mimetype: string,
  ): Promise<ServiceResult<FileDto>> {
    try {
      const response = await this.awsStorageService.uploadFile(
        dataBuffer,
        mimetype,
      );
      if (response instanceof ServerError) {
        return new ServerError<FileDto>(response.error.message);
      }

      const file = this.fileRepository.create({
        name: fileName,
        url: response.Location,
        key: response.Key,
        mime_type: mimetype,
      });

      if (file.mime_type === MIME_TYPE_WAV) {
        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        file.url_expiry = currentDate;
      }

      await this.fileRepository.save(file);

      return new ServiceResult<FileDto>(FileDto.fromEntity(file));
    } catch (error) {
      this.logger.error('FileService - upload', error);
      return new ServerError<FileDto>(`Can't upload file`);
    }
  }

  async putFile(
    id: string,
    dataBuffer: Buffer,
    fileName: string,
    mimetype: string,
  ): Promise<ServiceResult<FileDto>> {
    try {
      const file = await this.fileRepository.findOne({ where: { id } });

      if (!file) {
        return new NotFound<FileDto>('File not found');
      }

      const response = await this.awsStorageService.putFile(
        dataBuffer,
        file.key,
        mimetype,
      );

      if (response instanceof ServerError) {
        return new ServerError<FileDto>(response.error.message);
      }

      file.name = fileName;
      file.mime_type = mimetype;
      if (file.mime_type === MIME_TYPE_WAV) {
        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        file.url_expiry = currentDate;
      }

      await this.fileRepository.save(file);

      return new ServiceResult<FileDto>(FileDto.fromEntity(file));
    } catch (error) {
      this.logger.error('FileService - update file', error);
      return new ServerError<FileDto>(`Can't update file`);
    }
  }

  async remove(id: string): Promise<ServiceResult<string>> {
    try {
      const file = await this.fileRepository.findOne({ where: { id } });

      if (!file) {
        return new NotFound<string>('File not found');
      }

      const songsWithThisFile = await this.songRepository
        .createQueryBuilder('song')
        .where('song.music_id = :id OR song.art_id = :id', { id: file.id })
        .getMany();

      if (songsWithThisFile.length > 0) {
        return new ServerError<string>(
          'File is used in a song and cannot be deleted.',
        );
      }

      const response = await this.awsStorageService.removeFile(file.key);
      if (response instanceof ServerError) {
        return new ServerError<string>(response.error.message);
      }
      const fileId = file.id;
      await this.fileRepository.remove(file);

      return new ServiceResult<string>(fileId);
    } catch (error) {
      this.logger.error('FileService - remove', error);
      return new ServerError<string>(`Can't remove file`);
    }
  }

  async removeMany(fileIds: string[]): Promise<ServiceResult<boolean>> {
    if (fileIds.length > 0) {
      const files = await this.fileRepository.findByIds(fileIds);

      const songsWithTheseFiles = await this.songRepository
        .createQueryBuilder('song')
        .where('song.music_id IN (:...ids) OR song.art_id IN (:...ids)', {
          ids: fileIds,
        })
        .getMany();

      if (songsWithTheseFiles.length > 0) {
        return new ServerError<boolean>(
          'Some files are used in a song and cannot be deleted.',
        );
      }

      const awsKeys = files.map((file) => {
        return { Key: file.key };
      });

      const response = await this.awsStorageService.removeFiles(awsKeys);

      if (response instanceof ServerError) {
        return new ServerError<boolean>(response.error.message);
      }

      await this.fileRepository.remove(files);

      return new ServiceResult<boolean>(true);
    }

    return new ServiceResult<boolean>(false);
  }
}
