import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { RedisModule } from 'src/redis/redis.module';
import { EnvModule } from 'src/env/env.module';
import { JwtModule } from '@nestjs/jwt';
import { PollsRepository } from './polls.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ConfigModule, RedisModule, EnvModule, JwtModule, AuthModule],
  controllers: [PollsController],
  providers: [PollsService, PollsRepository],
})
export class PollsModule {}
