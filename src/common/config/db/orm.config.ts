import { DataSource, DataSourceOptions } from 'typeorm';
import { data_source_config } from './db';

export const AppDataSource = new DataSource({
  ...(data_source_config as DataSourceOptions),
});
