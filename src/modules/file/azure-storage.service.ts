import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerError } from '../../helpers/response/errors';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AzureStorageService {
  private readonly logger = new Logger(AzureStorageService.name);
  constructor(private readonly configService: ConfigService) {}

  async getfile(key: string) {
    const blobClient = this.getBlobClient(key);
    const response = await blobClient.download();
    if (response.errorCode) {
      this.logger.error('AzureStorageService - getFile', response.errorCode);
      return new ServerError<boolean>(`Error while downloading file`);
    }
    return response.readableStreamBody;
  }

  async uploadFile(dataBuffer: Buffer) {
    const key = uuid();
    const blobClient = this.getBlobClient(key);
    const response = await blobClient.uploadData(dataBuffer);
    if (response.errorCode) {
      this.logger.error('AzureStorageService - uploadFile', response.errorCode);
      return new ServerError<boolean>(`Error while uploading file`);
    }
    return {
      key: blobClient.name,
      url: blobClient.url,
    };
  }

  async putFile(key: string, dataBuffer: Buffer) {
    const blobClient = this.getBlobClient(key);
    const response = await blobClient.upload(dataBuffer, dataBuffer.length);
    if (response.errorCode) {
      this.logger.error('AzureStorageService - putFile', response.errorCode);
      return new ServerError<boolean>(`Error updating file`);
    }

    return true;
  }

  async removefile(key: string) {
    const blobClient = this.getBlobClient(key);
    const response = await blobClient.deleteIfExists();
    if (response.errorCode) {
      this.logger.error('AzureStorageService - removeFile', response.errorCode);
      return new ServerError<boolean>(`Error while removing file`);
    }

    return true;
  }

  async removeFiles(keys: string[]) {
    const blobClients: BlockBlobClient[] = [];
    for (const key of keys) {
      blobClients.push(this.getBlobClient(key));
    }
    const batchClient = this.getBlobBatchClient();
    const response = await batchClient.deleteBlobs(blobClients, {
      deleteSnapshots: 'include',
    });

    if (response.errorCode) {
      this.logger.error(
        'AzureStorageService - removeFiles',
        response.errorCode,
      );
      return new ServerError<boolean>(`Error while removing files`);
    }

    return true;
  }

  getBlobClient(imageName: string): BlockBlobClient {
    const blobClientService = BlobServiceClient.fromConnectionString(
      this.configService.get('azure.storage_connection_string'),
    );

    const containerClient = blobClientService.getContainerClient(
      this.configService.get('azure.container_name'),
    );

    const blobClient = containerClient.getBlockBlobClient(imageName);
    return blobClient;
  }

  getBlobBatchClient() {
    const blobClientService = BlobServiceClient.fromConnectionString(
      this.configService.get('azure.storage_connection_string'),
    );

    const containerClient = blobClientService.getContainerClient(
      this.configService.get('azure.container_name'),
    );

    const batchClient = containerClient.getBlobBatchClient();
    return batchClient;
  }
}
