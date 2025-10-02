import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 4003,
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  

  console.log('🛍️  Product Service is listening on port 4003');
}
bootstrap();