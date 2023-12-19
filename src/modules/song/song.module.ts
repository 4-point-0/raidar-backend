import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { File } from '../file/file.entity';
import { Album } from '../album/album.entity';
import { Licence } from '../licence/licence.entity';
import { User } from '../user/user.entity';
import { EmailService } from '../email/email.service';
import { HttpModule } from '@nestjs/axios';
import { CoingeckoModule } from '../coingecko/coingecko.module';
import { StripeService } from '../stripe/stripe.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Song, File, Album, User, Licence]),
    CoingeckoModule,
  ],
  providers: [SongService, EmailService, StripeService],
  controllers: [SongController],
})
export class SongModule {}
