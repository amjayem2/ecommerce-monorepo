import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.enableCors({
  //   origin: ['http://localhost:5173', 'http://localhost:3000'], // dashboard + web
  // });  
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();

