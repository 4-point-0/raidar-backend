import { Injectable, Logger } from '@nestjs/common';
import { ServiceResult } from '../../helpers/response/result';
import { NotFound, ServerError } from '../../helpers/response/errors';
import { FileDto } from './dto/file.dto';
import { File } from './file.entity';
import { AwsStorageService } from './aws-storage.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private readonly awsStorageService: AwsStorageService,
  ) {}

  async uploadFile(
    user_id: string,
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
        created_by_id: user_id,
        updated_by_id: user_id,
      });

      await this.fileRepository.save(file);

      return new ServiceResult<FileDto>(FileDto.fromEntity(file));
    } catch (error) {
      this.logger.error('FileService - upload', error);
      return new ServerError<FileDto>(`Can't upload file`);
    }
  }

  async putFile(
    user_id: string,
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
      file.updated_by_id = user_id;

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
