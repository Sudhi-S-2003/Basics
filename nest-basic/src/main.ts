import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ global interceptor for success responses
  app.useGlobalInterceptors(new ResponseInterceptor());

  // ✅ global filter for error responses
  app.useGlobalFilters(new AllExceptionsFilter());

  // ✅ Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Messages API')
    .setDescription('Simple message service with global response format')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
