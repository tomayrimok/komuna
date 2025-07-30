/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import { json, urlencoded } from 'express';

import { AppModule } from './app/app.module';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Enable CORS for client requests
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Configure request size limits for file uploads (500MB)
  // Note: This is quite large - consider optimizing images on client side
  app.use(json({ limit: '500mb' }));
  app.use(urlencoded({ extended: true, limit: '500mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  const port = process.env.PORT || 8080;
  app.use(cookieParser());
  // Set up swagger
  const config = new DocumentBuilder()
    .setTitle('Komuna')
    .setDescription('Komuna API description')
    .setVersion('1.0')
    .addTag('komuna')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./swagger.json', JSON.stringify(document, null, 2));

  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
