
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function createApp() {
  const app = await NestFactory.create(AppModule);

  // CORS Configuration - Security Enhancement
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3000']; // Fallback to localhost only

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️  Blocked CORS request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  return app;
}

// Logic for Vercel Serverless
export default async function (req: any, res: any) {
  const app = await createApp();
  await app.init();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
}

// Logic for Local Development
if (require.main === module) {
  (async () => {
    const app = await createApp();
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
  })();
}
