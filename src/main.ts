import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// process.on('unhandledRejection', (err) => {
//   console.error('UNHANDLED REJECTION:', err);
// });

// process.on('uncaughtException', (err) => {
//   console.error('UNCAUGHT EXCEPTION:', err);
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
