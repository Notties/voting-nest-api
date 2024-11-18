import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { RedisHealthIndicator } from './indicators/redis.health';
import { EnvService } from '../env/env.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private redis: RedisHealthIndicator,
    private memory: MemoryHealthIndicator,
    private readonly env: EnvService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    const baseUrl = `http://localhost:${this.env.APP_CONFIG.port}`;

    return this.health.check([
      // API Endpoint checks
      () => this.http.pingCheck('api', `${baseUrl}/api/v1`),

      // Redis check
      () => this.redis.isHealthy('redis'),

      // Memory check
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024), // 200MB
      () => this.memory.checkRSS('memory_rss', 3000 * 1024 * 1024), // 3000MB

      // Custom check example
      async () => {
        const uptime = process.uptime();
        const now = new Date();
        const datetime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
        return {
          customCheck: {
            status: 'up',
            environment: this.env.APP_CONFIG.env,
            version: this.env.APP_CONFIG.apiVersion,
            datetime,
            uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
          },
        };
      },
    ]);
  }
}
