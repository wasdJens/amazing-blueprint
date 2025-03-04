import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Create an app using Fastify instead of Express (Default from NestJS)
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  // Load the config from the config service to access configuration informations
  const configService = app.get(ConfigService);

  // Setup the Document for the Swagger OpenAPI Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Test')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  // Swagger will be exposed under `/swagger` and the json under /json
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  // Start the actual server
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
}
bootstrap();
