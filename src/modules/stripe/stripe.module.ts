import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Song } from '../song/song.entity';
import { Licence } from '../licence/licence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Song, Licence])],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
