import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from './env/env.module';
import { RedisModule } from './redis/redis.module';
import { HealthModule } from './health/health.module';
@Module({
  imports: [EnvModule, RedisModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
