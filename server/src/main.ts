import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(cookieParser());

  const clientUrl = config.get<string>('CLIENT_URL') || 'http://localhost:3000';
  const port = config.get<number>('PORT') || 3000;

  app.enableCors({ credentials: true, origin: clientUrl });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/v1');

  await app.listen(port);
}
bootstrap();
