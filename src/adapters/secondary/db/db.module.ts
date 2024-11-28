import { Module } from '@nestjs/common';
import { MysqlModule } from '@SecondaryAdapters/db/mysql/mysql.module';
import { RedisModule } from '@SecondaryAdapters/db/redis/redis.module';

@Module({
  imports: [MysqlModule, RedisModule],
  exports: [MysqlModule, RedisModule],
})
export default class DBModule {}
