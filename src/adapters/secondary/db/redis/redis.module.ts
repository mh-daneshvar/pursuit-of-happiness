import { Module } from '@nestjs/common';
import RedisInfrastructureService from '@SecondaryAdapters/db/redis/redis.infrastructureService';
import { REDIS_CLIENT } from '@SecondaryAdapters/db/redis/redisClient.type';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST');
        const port = configService.get<number>('REDIS_PORT');
        const password = configService.get<string>('REDIS_PASSWORD');
        const client = createClient({
          url: `redis://${host}:${port}`,
          password: password,
          database: +configService.get<number>('REDIS_DATABASE_NUMBER'),
        });
        await client.connect();
        return client;
      },
    },
    RedisInfrastructureService,
  ],
  exports: [RedisInfrastructureService],
})
export class RedisModule {}
