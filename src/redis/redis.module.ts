import { Global, Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Redis } from 'ioredis';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { RedisService } from './redis.service';
import { REDIS_CLIENT } from './redis.constants';

@Global()
@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (env: EnvService) => {
        return new Redis({
          host: env.REDIS_CONFIG.host,
          port: env.REDIS_CONFIG.port,
        });
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
