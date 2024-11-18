import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { RedisIoAdapter } from './adapters/redis-io.adapter';
import { EnvService } from './env/env.service';
import { SwaggerModule } from '@nestjs/swagger';
import { createDocument } from './swagger/swagger';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as basicAuth from 'express-basic-auth';

const SWAGGER_ENVS = ['local', 'development', 'staging'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose', 'fatal'],
  });
  const env: EnvService = app.get(EnvService);

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      transform: true,
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  if (SWAGGER_ENVS.includes(env.APP_CONFIG.env)) {
    app.use(
      ['/api-docs', '/docs-json'],
      basicAuth({
        challenge: true,
        users: {
          [env.SWAGGER_CONFIG.user]: env.SWAGGER_CONFIG.password,
        },
      }),
    );

    SwaggerModule.setup('api-docs', app, createDocument(app));
  }

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis(env.REDIS_CONFIG.url);

  app.useWebSocketAdapter(redisIoAdapter);
  await app.listen(env.APP_CONFIG.port, '0.0.0.0');
  console.info(
    'Server listening on: ',
    `http://localhost:${env.APP_CONFIG.port}/api/v1`,
  );
}
bootstrap();
