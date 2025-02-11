import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

// Used to improve type safety in Nestjs
import '@total-typescript/ts-reset';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from "cookie-parser";

import { ConfigService } from '@nestjs/config';
import type { EnvConfig } from './app/common/config/env.schema';
import { ZodValidationPipe } from './app/common/pipes/zod-validation.pipe';

import { generateHttpsCredentials, generateKeys } from './genKeys';

async function bootstrap() {
  // generate the keys that will be used in the auth system later!
  generateKeys();

  // Generate HTTPS credentials
  const httpsOptions = generateHttpsCredentials();

  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  const configService = app.get(ConfigService<EnvConfig, true>);

  app.useGlobalPipes(new ZodValidationPipe());

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 3600,
    preflightContinue: false,
  });

  app.use(compression());
  app.use(helmet());
  app.useLogger(
    new Logger(configService.get('MODE') === 'production' ? 'log' : 'verbose'),
  );
  app.use(cookieParser(configService.get('COOKIE_SECRET')));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = configService.get('PORT', { infer: true });
  const hostname = configService.get('HOSTNAME', { infer: true });

  const config = new DocumentBuilder()
    .setTitle('El-Marchi-API')
    .setDescription('The El-Marchi-API Description')
    .setVersion('1.0')
    .addTag('e-commerce')
    .addTag('rest')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  await app.listen(port, hostname);

  Logger.log(
    `🚀 Application is running in ${configService.get('NODE_ENV')} mode on:\n` +
    `- http://${hostname}:${port}/${globalPrefix}\n` +
    `- ${await app.getUrl()}`,
  );
}

bootstrap();
