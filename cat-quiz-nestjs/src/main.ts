import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  app.use(require('express').urlencoded({ extended: true }));

  // настройка статических файлов и шаблонов
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Server running on port ${port}`);
}
bootstrap();
