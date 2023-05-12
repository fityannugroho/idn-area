import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // This app use fastify.
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Init API documentation with Swagger.
  const docConfig = new DocumentBuilder()
    .setTitle('Indonesia Area API')
    .setVersion(process.env.npm_package_version)
    .setDescription(
      'API that provides information about Indonesia administrative area.',
    )
    .setLicense(
      'MIT License',
      'https://github.com/fityannugroho/idn-area/blob/master/LICENSE',
    )
    .setExternalDoc(
      'See on GitHub',
      'https://github.com/fityannugroho/idn-area',
    )
    .build();
  // Create the API documentation.
  const doc = SwaggerModule.createDocument(app, docConfig);
  // Set the endpoint for API documentation.
  const docPath = 'docs';
  // Setup the API documentation.
  SwaggerModule.setup(docPath, app, doc);

  // Enable CORS protocol
  app.enableCors();

  // Set auto-validation pipe.
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Configure app host and port.
  const host = process.env.HOST || '0.0.0.0';
  const port = process.env.PORT || 3000;

  // Start the app.
  await app.listen(port, host);
  console.log(`App run successfully on ${await app.getUrl()}.`);
}
bootstrap();
