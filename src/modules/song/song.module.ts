import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { File } from '../file/file.entity';
import { Album } from '../album/album.entity';
import { Listing } from '../listing/listing.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song, File, Album, User, Listing])],
  providers: [SongService],
  controllers: [SongController],
})
export class SongModule {}
