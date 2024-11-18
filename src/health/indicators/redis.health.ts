import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Check Redis
      const timestamp = Date.now().toString();
      await this.redisService.set('health-check', timestamp, 10);
      const result = await this.redisService.get('health-check');

      const isHealthy = result === timestamp;

      if (isHealthy) {
        return this.getStatus(key, true);
      }

      throw new Error('Redis health check failed');
    } catch (error) {
      throw new HealthCheckError(
        'Redis health check failed',
        this.getStatus(key, false, { message: error.message }),
      );
    }
  }
}
