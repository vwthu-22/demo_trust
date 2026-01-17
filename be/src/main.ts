
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function createApp() {
  const app = await NestFactory.create(AppModule);

  // CORS Configuration - Security Enhancement
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : ['https://naisu-tau.vercel.app']; // TEMPORARY: Allow all origins if env var not set

  console.log('🔒 CORS Allowed Origins:', allowedOrigins);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, curl)
      if (!origin) {
        console.log('✅ Allowing request with no origin');
        return callback(null, true);
      }

      // If wildcard is in allowed origins, allow all
      if (allowedOrigins.includes('*')) {
        console.log(`✅ Allowing CORS from: ${origin} (wildcard mode)`);
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        console.log(`✅ Allowing CORS from: ${origin}`);
        callback(null, true);
      } else {
        console.warn(`⚠️  Blocked CORS request from origin: ${origin}`);
        // Don't throw error, just reject the request
        callback(null, false);
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
