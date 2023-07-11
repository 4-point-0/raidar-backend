import { Module } from '@nestjs/common';
import { AwsStorageService } from './aws-storage.service';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { Song } from '../song/song.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File, Song])],
  controllers: [FileController],
  providers: [AwsStorageService, FileService],
  exports: [FileService],
})
export class FileModule {}
