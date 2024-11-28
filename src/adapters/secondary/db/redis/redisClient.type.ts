import { createClient, RedisClientType } from 'redis';

export type RedisClient = RedisClientType;
export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
