import { LoggingInterceptor } from './app/core/interceptors/logging.interceptor';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app/app.module';
import { LoggingExceptionFilter } from './app/core/exception-filter/logging.exception-filter';
import { winstonOptionsFactory } from './app/core/utilities/winston-options';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppConfig } from './app/app.config';

async function bootstrap() {
  // Logger setup
  const logger = WinstonModule.createLogger(winstonOptionsFactory()) as Logger;
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: logger,
    }
  );
  const { httpAdapter } = app.get(HttpAdapterHost);

  // App setup
  const globalPrefix = 'api';
  app.useGlobalInterceptors(
    new LoggingInterceptor(logger, {
      ignoreRoutes: [`${globalPrefix}/health`],
    })
  );
  app.useGlobalFilters(new LoggingExceptionFilter(logger, httpAdapter));
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(globalPrefix);

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Degen-API')
    .setDescription('Core DEGEN API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Init server
  await app.listen(AppConfig.API_PORT).then(() => {
    logger.log(
      `Running on: http://localhost:${AppConfig.API_PORT}/${globalPrefix}`,
      'Main'
    );
  });
}

bootstrap();
