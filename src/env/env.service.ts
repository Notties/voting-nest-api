import { ConfigService } from '@nestjs/config';
import {
  Environment,
  IAppConfig,
  IJwtConfig,
  IRedisConfig,
  ISwaggerConfig,
} from './env.validations';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvService {
  public readonly APP_CONFIG: IAppConfig;
  public readonly REDIS_CONFIG: IRedisConfig;
  public readonly SWAGGER_CONFIG: ISwaggerConfig;
  public readonly JWT_CONFIG: IJwtConfig;

  constructor(private readonly config: ConfigService) {
    this.APP_CONFIG = {
      env: this.config.get<Environment>('NODE_ENV', Environment.Development),
      port: parseInt(this.config.get<string>('SERVER_PORT'), 10),
      name: this.config.get<string>('APP_NAME'),
      apiVersion: this.config.get<string>('API_VERSION'),
    };

    this.JWT_CONFIG = {
      secret: this.config.get<string>('JWT_SECRET'),
    };

    this.REDIS_CONFIG = {
      host: this.config.get<string>('REDIS_HOST'),
      port: this.config.get<number>('REDIS_PORT'),
      url: this.config.get<string>('REDIS_URL'),
      pollDuration: this.config.get<number>('POLL_DURATION'),
    };

    this.SWAGGER_CONFIG = {
      user: this.config.get<string>('SWAGGER_USER'),
      password: this.config.get<string>('SWAGGER_PASSWORD'),
    };
  }
}
