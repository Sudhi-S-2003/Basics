import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { OrderModule } from './order.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrderModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 4002,
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen();
  console.log('Order Service is listening on port 4002');
}

bootstrap();