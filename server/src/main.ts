import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cookieParser() as any); // evita erro de 'any' do cookie-parser no ESLint

  // Pega a URL do cliente e a porta, colocando default caso não tenha
  const clientUrl = config.get<string>('CLIENT_URL') || 'http://localhost:3000';
  const port = config.get<number>('PORT') || 3000;

  app.enableCors({ credentials: true, origin: clientUrl });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/v1');

  await app.listen(port);
}
bootstrap();
