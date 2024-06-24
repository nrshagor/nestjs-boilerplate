// main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const allowedOrigins = [
    'http://localhost:3001',
    'http://localhost:3000',
    '*',
    process.env.NEXTJS_FRONTEND_URL,
  ];

  // Configure CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies to be sent and received
  });
  await app.listen(3000);
}
bootstrap();
