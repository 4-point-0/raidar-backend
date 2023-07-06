import { Module } from '@nestjs/common';
import { AwsStorageService } from './aws-storage.service';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  controllers: [FileController],
  providers: [AwsStorageService, FileService],
  exports: [FileService],
})
export class FileModule {}
