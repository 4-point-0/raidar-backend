import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { ServerError } from '../../helpers/response/errors';
import { v4 as uuid } from 'uuid';
import { AwsFileKeyDto } from '../campaign/dto/aws-file-key.dto';

@Injectable()
export class AwsStorageService {
  private readonly logger = new Logger(AwsStorageService.name);
  constructor(private readonly configService: ConfigService) {}

  async uploadFile(dataBuffer: Buffer, mimetype: string) {
    try {
      const s3 = this.getS3();
      const params = {
        Bucket: this.configService.get('aws.bucket_name'),
        Key: `${uuid()}`,
        Body: dataBuffer,
        ACL: 'public-read',
        ContentType: mimetype,
        ContentDisposition: 'inline',
        CreateBucketConfiguration: {
          LocationConstraint: this.configService.get('aws.region'),
        },
      };

      return await s3.upload(params).promise();
    } catch (error) {
      this.logger.error('AwsStorageService - uploadFile', error);
      return new ServerError<boolean>(`Error while uploading file`);
    }
  }

  async putFile(dataBuffer: Buffer, key: string, mimetype: string) {
    const s3 = this.getS3();
    const params = {
      Bucket: this.configService.get('aws.bucket_name'),
      Key: key,
      Body: dataBuffer,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    const response = await s3.putObject(params).promise();

    if (response.$response.error) {
      this.logger.error(
        'AwsStorageService - putFile',
        response.$response.error.message,
      );
      return new ServerError<boolean>(`Error while updating file`);
    }

    return true;
  }

  async removeFile(key: string) {
    const s3 = this.getS3();
    const params = {
      Bucket: this.configService.get('aws.bucket_name'),
      Key: key,
    };

    const response = await s3.deleteObject(params).promise();
    if (response.$response.error) {
      this.logger.error(
        'AwsStorageService - removeFile',
        response.$response.error.message,
      );
      return new ServerError<boolean>(`Error while removing file`);
    }

    return true;
  }

  async removeFiles(keys: AwsFileKeyDto[]) {
    const s3 = this.getS3();
    const response = await s3
      .deleteObjects({
        Bucket: this.configService.get('aws.bucket_name'),
        Delete: {
          Objects: keys,
        },
      })
      .promise();

    if (response.Errors.length > 0) {
      this.logger.error('AwsStorageService - removeFiles', response.Errors);
      return new ServerError<boolean>(`Error while removing files`);
    }

    return true;
  }

  getS3() {
    return new S3({
      accessKeyId: this.configService.get('aws.access_key'),
      secretAccessKey: this.configService.get('aws.secret_key'),
    });
  }
}
