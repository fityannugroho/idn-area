import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  // This app use fastify.
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Configure app host and port.
  const host = process.env.HOST;
  const port = process.env.PORT;

  // Start the app.
  await app.listen(port, host);
  console.log(`App run successfully on ${await app.getUrl()}.`);
}
bootstrap();
