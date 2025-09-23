import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
    {
      bufferLogs: true,
    },
  );

  // Use Pino logger
  app.useLogger(app.get(Logger));

  // Enable CORS
  await app.register(require('@fastify/cors'), {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://www.inovacode.dev',
      'https://inovacode.dev',
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);
  const host = configService.get<string>('HOST', '0.0.0.0');

  await app.listen(port, host);
  console.log(`🚀 API running on http://${host}:${port}`);
}

// For serverless environments
let cachedApp: any;

export async function createApp(): Promise<any> {
  if (!cachedApp) {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({ logger: false }),
      {
        bufferLogs: true,
      },
    );

    app.useLogger(app.get(Logger));

    await app.register(require('@fastify/cors'), {
      origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://www.inovacode.dev',
        'https://inovacode.dev',
      ],
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}

// Only run bootstrap if not in serverless environment
if (require.main === module) {
  bootstrap();
}
