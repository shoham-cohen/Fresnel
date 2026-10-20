import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // Validates every DTO and rejects fields it does not declare.
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  // The mobile app in the browser (Expo web, localhost:8081) calls the API on another origin.
  app.enableCors();
  app.enableShutdownHooks();
  await app.listen(process.env.API_PORT ?? 3000);
}

void bootstrap();
