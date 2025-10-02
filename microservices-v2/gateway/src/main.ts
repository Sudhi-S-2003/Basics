import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');
  
  await app.listen(3000);
  

  console.log('🚀 API Gateway is running on http://localhost:3000');
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});