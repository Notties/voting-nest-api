import { Global, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import IORedis, { Redis } from 'ioredis';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { RedisService } from './redis.service';
import { REDIS_CLIENT } from './redis.constants';
import { ConfigModule } from '@nestjs/config';
@Global()
@Module({
  imports: [EnvModule, ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (env: EnvService) => {
        const logger = new Logger('RedisModule');
        const connectionOptions = {
          host: env.REDIS_CONFIG.host,
          port: env.REDIS_CONFIG.port,
        };
        const client: Redis = new IORedis(connectionOptions);
        client.on('error', (err) => {
          logger.error('Redis Client Error: ', err);
        });
        client.on('connect', () => {
          logger.log(
            `Connected to redis on ${client.options.host}:${client.options.port}`,
          );
        });
        return {
          connectionOptions,
        };
      },
      inject: [EnvService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown(): Promise<void> {
    const redisClient = this.moduleRef.get<Redis>(REDIS_CLIENT);

    return new Promise((resolve) => {
      redisClient.quit();
      redisClient.on('end', resolve);
    });
  }
}
