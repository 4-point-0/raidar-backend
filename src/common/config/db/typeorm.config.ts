import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { data_source_config } from './db';

export default class TypeOrmConfig {
  static getOrmConfig(): TypeOrmModuleOptions {
    return data_source_config as any;
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (): Promise<TypeOrmModuleOptions> =>
    TypeOrmConfig.getOrmConfig(),
  inject: [ConfigService],
};
