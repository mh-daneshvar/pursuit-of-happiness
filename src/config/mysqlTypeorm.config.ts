import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import * as process from 'process';

dotenvConfig({ path: '.env' });

const config = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT, 10),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  logging: process.env.MYSQL_VERBOSE_MODE == 'true',
  extra: {
    connectTimeout: 5000,
  },
  entities: [
    path.join(
      __dirname,
      '../adapters/secondary/db/mysql/schemas/**/*.schema.{ts,js}',
    ),
  ],
  migrations: [
    path.join(
      __dirname,
      '../adapters/secondary/db/mysql/migrations/**/*.{ts,js}',
    ),
  ],
  migrationsTableName: 'migrations',
  autoLoadEntities: false,
  synchronize: false,
  migrationsRun: process.env.MYSQL_RUN_MIGRATION == 'true',
};

export default registerAs('mysql-typeorm', () => config);
export const mysqlDataSource = new DataSource(config as DataSourceOptions);
