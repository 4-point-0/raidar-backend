import { DataSource, DataSourceOptions } from 'typeorm';
import { data_source_config } from './db';

const AppDataSource = new DataSource(data_source_config as DataSourceOptions);

export default AppDataSource;