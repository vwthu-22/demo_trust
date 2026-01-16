
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function createApp() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
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
    console.log(`🚀 Application is running on: http://localhost:${port}`);
  })();
}
