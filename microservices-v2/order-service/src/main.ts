import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: { host: '127.0.0.1', port: 4004 },
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  

  console.log('📦 Order Service is listening on port 4004');
}
bootstrap();
