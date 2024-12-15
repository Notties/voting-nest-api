import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from 'src/env/env.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly env: EnvService,
    private readonly jwtService: JwtService,
  ) {}

  createAccessToken(pollId: string, name: string, userId: string) {
    const accessToken = this.jwtService.sign(
      {
        pollID: pollId,
        name: name,
      },
      {
        subject: userId,
        secret: this.env.JWT_CONFIG.secret,
      },
    );

    return accessToken;
  }
}
