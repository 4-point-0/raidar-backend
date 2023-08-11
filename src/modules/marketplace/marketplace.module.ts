import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from '../song/song.entity';
import { File } from '../file/file.entity';
import { Album } from '../album/album.entity';
import { Licence } from '../licence/licence.entity';
import { User } from '../user/user.entity';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';

@Module({
  imports: [TypeOrmModule.forFeature([Song, File, Album, User, Licence])],
  providers: [MarketplaceService],
  controllers: [MarketplaceController],
})
export class MarketplaceModule {}
