import { Module } from '@nestjs/common';
import { AwsStorageService } from './aws-storage.service';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [FileController],
  providers: [AwsStorageService, FileService],
  exports: [FileService],
})
export class FileModule {}
