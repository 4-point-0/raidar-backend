import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CoingeckoService } from './coingecko.service';
import { CoingeckoController } from './coingecko.controller';

@Module({
  imports: [HttpModule],
  exports: [CoingeckoService],
  providers: [CoingeckoService],
  controllers: [CoingeckoController],
})
export class CoingeckoModule {}
