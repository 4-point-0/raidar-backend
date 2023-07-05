import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AwsStorageService } from './aws-storage.service';
import { AzureStorageService } from './azure-storage.service';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  controllers: [FileController],
  providers: [
    PrismaService,
    AwsStorageService,
    AzureStorageService,
    FileService,
  ],
  exports: [FileService],
})
export class FileModule {}
