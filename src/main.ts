import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  /**
   * Add the Validation Pipe to work globally
   */
  app.useGlobalPipes(new ValidationPipe());
  // --

  app.enableCors();
  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
