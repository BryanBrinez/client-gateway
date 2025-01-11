import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionFilter } from './common/exceptions/rpc-exception.filter';

async function bootstrap() {
  console.log('running on port client gateway', envs.port);
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'http://localhost:3001', // Permite solicitudes desde el frontend en http://localhost:3000
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new ExceptionFilter());
  await app.listen(envs.port);

  console.log('Cliente gateway');
}
bootstrap();
