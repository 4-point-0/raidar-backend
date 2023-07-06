import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceResult } from '../../helpers/response/result';
import {
  BadRequest,
  NotFound,
  ServerError,
  Unauthorized,
} from '../../helpers/response/errors';
import { FileDto } from './dto/file.dto';
import { AwsStorageService } from './aws-storage.service';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly awsStorageService: AwsStorageService,
  ) {}

  async uploadFile(
    user_id: string,
    organization_id: string,
    dataBuffer: Buffer,
    fileName: string,
    mimetype: string,
    tags: string[],
  ): Promise<ServiceResult<FileDto>> {
    try {
      if (!organization_id) {
        return new NotFound<FileDto>(
          `Organization not found, please create one first!`,
        );
      }

      const organization = await this.prismaService.organization.findFirst({
        where: { id: organization_id },
      });

      if (!organization) {
        return new BadRequest<FileDto>(
          `Organization not found, please create one first!`,
        );
      }

      let file: File;

      const response = await this.awsStorageService.uploadFile(
        dataBuffer,
        mimetype,
      );
      if (response instanceof ServerError) {
        return new ServerError<FileDto>(response.error.message);
      }

      file = await this.prismaService.file.create({
        data: {
          name: fileName,
          url: response.Location,
          key: response.Key,
          mime_type: mimetype,
          created_by_id: user_id,
          updated_by_id: user_id,
          tags: tags ? tags : undefined,
        },
      });

      return new ServiceResult<FileDto>(FileDto.fromEntity(file));
    } catch (error) {
      this.logger.error('FileService - upload', error);
      return new ServerError<FileDto>(`Can't upload file`);
    }
  }

  async putFile(
    user_id: string,
    organization_id: string,
    id: string,
    dataBuffer: Buffer,
    fileName: string,
    mimetype: string,
    tags: string[],
  ): Promise<ServiceResult<FileDto>> {
    try {
      if (!organization_id) {
        return new NotFound<FileDto>(
          `Organization not found, please create one first!`,
        );
      }

      const file = await this.prismaService.file.findFirst({
        where: { id },
      });

      if (!file) {
        return new NotFound<FileDto>('File not found');
      }

      const organization = await this.prismaService.organization.findFirst({
        where: { id: organization_id },
      });

      if (!organization) {
        return new BadRequest<FileDto>(
          `Organization not found, please create one first!`,
        );
      }

      if (file.campaign_id) {
        const campaign = await this.prismaService.campaign.findFirst({
          where: { id: file.campaign_id },
        });

        if (campaign.organization_id !== organization_id) {
          return new Unauthorized<FileDto>(
            `Not authorized to update this file`,
          );
        }
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
      file.tags = tags ? tags : [];
      file.updated_by_id = user_id;

      await this.prismaService.file.update({
        where: { id: file.id },
        data: file,
      });

      const updatedFile = await this.prismaService.file.findFirst({
        where: { id },
      });

      return new ServiceResult<FileDto>(FileDto.fromEntity(updatedFile));
    } catch (error) {
      this.logger.error('FileService - update file', error);
      return new ServerError<FileDto>(`Can't update file`);
    }
  }

  async remove(
    id: string,
    organization_id: string,
  ): Promise<ServiceResult<string>> {
    try {
      if (!organization_id) {
        return new NotFound<string>(
          `Organization not found, please create one first!`,
        );
      }

      const file = await this.prismaService.file.findFirst({
        where: { id },
      });

      if (!file) {
        return new NotFound<string>('File not found');
      }

      const organization = await this.prismaService.organization.findFirst({
        where: { id: organization_id },
      });

      if (!organization) {
        return new BadRequest<string>(
          `Organization not found, please create one first!`,
        );
      }

      const nft = await this.prismaService.nft.findFirst({
        where: { file_id: file.id },
      });

      if (nft) {
        return new BadRequest<string>(`Can't remove file. File is used in NFT`);
      }

      if (file.campaign_id) {
        const campaign = await this.prismaService.campaign.findFirst({
          where: { id: file.campaign_id },
        });

        if (campaign.organization_id !== organization_id) {
          return new Unauthorized<string>(`Not authorized to remove this file`);
        }
      }

      const response = await this.awsStorageService.removeFile(file.key);
      if (response instanceof ServerError) {
        return new ServerError<string>(response.error.message);
      }

      const fileDeleated = await this.prismaService.file.delete({
        where: {
          id: file.id,
        },
      });

      return new ServiceResult<string>(fileDeleated.id);
    } catch (error) {
      this.logger.error('FileService - remove', error);
      return new ServerError<string>(`Can't remove file`);
    }
  }

  async removeMany(
    fileIds: string[],
    organization_id: string,
    campaign_organization_id: string,
  ): Promise<ServiceResult<boolean>> {
    if (!organization_id) {
      return new NotFound<boolean>(
        `Organization not found, please create one first!`,
      );
    }

    const organization = await this.prismaService.organization.findFirst({
      where: { id: organization_id },
    });

    if (!organization) {
      return new BadRequest<boolean>(
        `Organization not found, please create one first!`,
      );
    }

    if (fileIds.length > 0) {
      const files = await this.prismaService.file.findMany({
        where: {
          id: {
            in: fileIds,
          },
        },
      });

      if (organization_id !== campaign_organization_id) {
        return new Unauthorized<boolean>('Not authorized to remove files');
      }

      const awsKeys = files.map((file) => {
        return { Key: file.key };
      });
      const response = await this.awsStorageService.removeFiles(awsKeys);
      if (response instanceof ServerError) {
        return new ServerError<boolean>(response.error.message);
      }

      await this.prismaService.file.deleteMany({
        where: {
          id: {
            in: fileIds,
          },
        },
      });
      return new ServiceResult<boolean>(true);
    }
    return new ServiceResult<boolean>(false);
  }
}
