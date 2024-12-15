import { InternalServerErrorException } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { EnvService } from 'src/env/env.service';
import { CreatePollData, Poll } from './types';
import { RedisService } from 'src/redis/redis.service';
import { parseTTL } from 'src/utils/ttl';

@Injectable()
export class PollsRepository {
  // to use time-to-live from configuration
  private readonly ttl: number;
  private readonly logger = new Logger(PollsRepository.name);
  constructor(
    private readonly env: EnvService,
    private readonly redisService: RedisService,
  ) {
    this.ttl = parseTTL(this.env.JWT_CONFIG.accessTokenExpiration);
  }

  async createPoll({
    votesPerVoter,
    topic,
    pollID,
    userID,
  }: CreatePollData): Promise<Poll> {
    const initialPoll = {
      id: pollID,
      topic,
      votesPerVoter,
      adminID: userID,
      participants: {},
      hasStarted: false,
    };

    this.logger.log(
      `Creating new poll: ${JSON.stringify(initialPoll, null, 2)} with TTL ${
        this.ttl
      }`,
    );

    const key = `polls:${pollID}`;

    try {
      await this.redisService
        .multi([
          ['send_command', 'JSON.SET', key, '.', JSON.stringify(initialPoll)],
          ['expire', key, this.ttl],
        ])
        .exec();
      return initialPoll;
    } catch (e) {
      this.logger.error(
        `Failed to add poll ${JSON.stringify(initialPoll)}\n${e}`,
      );
      throw new InternalServerErrorException();
    }
  }
}
