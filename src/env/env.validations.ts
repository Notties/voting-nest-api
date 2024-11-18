import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
}

export interface IAppConfig {
  env: string;
  port: number;
  name: string;
  apiVersion: string;
}

export interface IRedisConfig {
  host: string;
  port: number;
  url: string;
}

export interface ISwaggerConfig {
  user: string;
  password: string;
}

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  APP_NAME = 'voting-nest-api';
  @IsNumber()
  @IsNotEmpty()
  SERVER_PORT = 3000;
  @IsString()
  @IsNotEmpty()
  API_VERSION: string;

  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  // Redis
  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string;
  @IsNumber()
  @IsNotEmpty()
  REDIS_PORT: number;
  @IsString()
  @IsNotEmpty()
  REDIS_URL: number;

  // Swagger
  @IsString()
  @IsNotEmpty()
  SWAGGER_USER: string;
  @IsString()
  @IsNotEmpty()
  SWAGGER_PASSWORD: string;
}

export function validateEnvironmentVariables(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      errors.map((error) => Object.values(error.constraints)[0]).join('\n'),
    );
  }

  return validatedConfig;
}
