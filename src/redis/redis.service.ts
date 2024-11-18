import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {
    this.client = this.redis;
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  // Basic operations
  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    if (ttl) {
      return this.client.set(key, value, 'EX', ttl);
    }
    return this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  // Hash operations
  async hset(key: string, field: string, value: string): Promise<number> {
    return this.client.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  // List operations
  async lpush(key: string, ...values: string[]): Promise<number> {
    return this.client.lpush(key, ...values);
  }

  async rpush(key: string, ...values: string[]): Promise<number> {
    return this.client.rpush(key, ...values);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.client.lrange(key, start, stop);
  }

  // Cache decorator
  async cache<T>(
    key: string,
    ttl: number,
    fetchData: () => Promise<T>,
  ): Promise<T> {
    const cachedData = await this.get(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const data = await fetchData();
    await this.set(key, JSON.stringify(data), ttl);
    return data;
  }
}
