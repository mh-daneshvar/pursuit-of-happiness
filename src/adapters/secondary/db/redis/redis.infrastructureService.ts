import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  REDIS_CLIENT,
  RedisClient,
} from '@SecondaryAdapters/db/redis/redisClient.type';

@Injectable()
export default class RedisInfrastructureService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly client: RedisClient) {}

  async onModuleDestroy() {
    await this.client.quit();
  }

  async readOrCreate(
    key: string,
    valueToSet: string | number,
    ttlInSeconds = 120,
  ): Promise<{
    wasExist: boolean;
    isCreated: boolean;
    newValue: string;
  }> {
    valueToSet = valueToSet.toString();

    const transaction = this.client.multi();

    transaction
      .get(key) // Attempt to get the value of the key
      .setNX(key, valueToSet) // Set the value if the key does not exist
      .get(key); // Get the value again to ensure the correct response

    try {
      const results = await transaction.exec();

      if (results) {
        const wasExist = results[0];
        const isCreated = results[1];
        const newValue = results[2];

        if (isCreated && ttlInSeconds) {
          await this.client.expire(key, ttlInSeconds);
        }

        return {
          wasExist: !!wasExist,
          isCreated: !!isCreated,
          newValue: newValue.toString(),
        };
      }
      throw new Error('Transaction failed to execute');
    } catch (error) {
      throw new Error('Redis transaction error: ' + error.message);
    }
  }

  async delete(key: string): Promise<any> {
    return await this.client.del(key);
  }
}
