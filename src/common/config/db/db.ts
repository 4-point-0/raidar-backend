import * as dotenv from 'dotenv';
import { existsSync } from 'fs';

dotenv.config({
  path: existsSync(`.env.${process.env.MODE}`)
    ? `.env.${process.env.MODE}`
    : '.env',
});

export const data_source_config = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  entities: ['dist/**/*.entity{.ts,.js}'],
  logging: true,
  logger: 'file',
  synchronize: false,
  migrationsRun: false,
  migrations: ['dist/**/migrations/*{ .ts,.js}'],
  migrationsTableName: '_typeorm_migrations',
};
