import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './contract.entity';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { AwsStorageService } from '../file/aws-storage.service';
import { User } from '../user/user.entity';
import { Song } from '../song/song.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, User, Song])],
  providers: [ContractService, AwsStorageService],
  controllers: [ContractController],
})
export class ContractModule {}
