import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from '../song/song.entity';
import { File } from '../file/file.entity';
import { Album } from '../album/album.entity';
import { Listing } from '../listing/listing.entity';
import { User } from '../user/user.entity';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { createAlgoliaClient } from 'src/helpers/algolia/algolia.client.provider';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Song, File, Album, User, Listing])],
  providers: [
    MarketplaceService,
    {
      provide: 'AlgoliaClient_songs',
      useFactory: (configService: ConfigService) =>
        createAlgoliaClient(configService, 'dev_songs'),
      inject: [ConfigService],
    },
  ],
  controllers: [MarketplaceController],
})
export class MarketplaceModule {}
