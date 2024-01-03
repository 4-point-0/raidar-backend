import { Module } from '@nestjs/common';
import { NearProviderService } from './near-provider.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [NearProviderService],
  exports: [NearProviderService],
})
export class NearProviderModule {}
