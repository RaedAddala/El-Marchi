import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import 'reflect-metadata';

import { AppModule } from './app/app.module';

// Used to improve type safety in Nestjs
import '@total-typescript/ts-reset';
import compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  });

  app.use(compression());
  app.use(helmet());
  app.useLogger(
    new Logger(process.env.MODE == 'production' ? 'log' : 'verbose'),
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3000;
  const hostname = process.env.HOSTNAME || '0.0.0.0';

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
    `🚀 Application is running on:\n- http://${hostname}:${port}/${globalPrefix}\n- ${await app.getUrl()}`,
  );
}

bootstrap();
