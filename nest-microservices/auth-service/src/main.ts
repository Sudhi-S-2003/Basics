import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions, RpcException } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 4001,
      },
    },
  );

  // app.useGlobalPipes(new ValidationPipe());
  // Enable ValidationPipe globally for TCP messages
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors
          .map(err => Object.values(err.constraints || {}))
          .flat();
        // Wrap messages directly in RpcException
        return new RpcException(messages);
      },
    }),
  
);
  await app.listen();
  console.log('Auth Service is listening on port 4001');
}

bootstrap();