import { Injectable, Logger } from '@nestjs/common';
import { CreatePollFields, JoinPollFields, RejoinPollFields } from './types';
import { createPollID, createUserID } from 'src/utils/ids';
import { PollsRepository } from './polls.repository';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class PollsService {
  private readonly logger = new Logger(PollsService.name);

  constructor(
    private readonly pollsRepository: PollsRepository,
    private readonly authService: AuthService,
  ) {}
  async createPoll(fields: CreatePollFields) {
    const pollID = createPollID();
    const userID = createUserID();

    const createdPoll = await this.pollsRepository.createPoll({
      ...fields,
      pollID,
      userID,
    });

    this.logger.debug(
      `Creating token string for pollID: ${createdPoll.id} and userID: ${userID}`,
    );

    const signedString = this.authService.createAccessToken(
      createdPoll.id,
      fields.name,
      userID,
    );

    if (!signedString) return null;

    return {
      poll: createdPoll,
      accessToken: signedString,
    };
  }
  async joinPoll(fields: JoinPollFields) {
    const userID = createUserID();

    return {
      ...fields,
      userID,
    };
  }
  async rejoinPoll(fields: RejoinPollFields) {
    return fields;
  }
}
